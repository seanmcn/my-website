const fs = require('fs');
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const slugify = require('slugify');

const NEW_CATEGORY_VALUE = '__new_category__';

function normalizeTaxonomyValue(value) {
  return slugify(String(value || '').trim(), {
    lower: true,
    strict: true,
  });
}

function formatTaxonomyLabel(value) {
  return value
      .split('-')
      .filter(Boolean)
      .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(' ');
}

function escapeSingleQuotedYaml(value) {
  return String(value).replace(/'/g, '\'\'');
}

function formatYamlStringArray(values) {
  if (!values.length) {
    return '[]';
  }

  return `[${values.map(value => `'${escapeSingleQuotedYaml(value)}'`).join(', ')}]`;
}

function walkBlogFiles(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];

  entries.forEach(entry => {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...walkBlogFiles(fullPath));
      return;
    }

    if (/\.(md|mdx)$/u.test(entry.name)) {
      files.push(fullPath);
    }
  });

  return files;
}

function readFrontmatter(filePath) {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const match = fileContents.match(/^---\n([\s\S]*?)\n---/u);

  return match ? match[1] : '';
}

function parseSingleValue(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'mu'));

  if (!match) {
    return '';
  }

  return match[1].trim()
      .replace(/^['"]|['"]$/gu, '')
      .trim();
}

function parseArrayValue(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'mu'));

  if (!match) {
    return [];
  }

  const rawValue = match[1].trim();
  if (!rawValue.startsWith('[') || !rawValue.endsWith(']')) {
    return [];
  }

  return rawValue
      .slice(1, -1)
      .split(',')
      .map(value => value.trim().replace(/^['"]|['"]$/gu, '').trim())
      .filter(Boolean);
}

function mapCountsToChoices(countMap) {
  return Array.from(countMap.entries())
      .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
      .map(([value, count]) => ({
        name: `${formatTaxonomyLabel(value)} (${count})`,
        value,
      }));
}

function collectTaxonomyChoices(contentRoot) {
  const categoryCounts = new Map();
  const tagCounts = new Map();

  walkBlogFiles(contentRoot).forEach(filePath => {
    const frontmatter = readFrontmatter(filePath);
    if (!frontmatter) {
      return;
    }

    const category = parseSingleValue(frontmatter, 'category');
    if (category) {
      categoryCounts.set(category, (categoryCounts.get(category) || 0) + 1);
    }

    parseArrayValue(frontmatter, 'tags').forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  return {
    categories: mapCountsToChoices(categoryCounts),
    tags: mapCountsToChoices(tagCounts),
  };
}

function parseAdditionalTags(rawValue) {
  return String(rawValue || '')
      .split(',')
      .map(normalizeTaxonomyValue)
      .filter(Boolean);
}

function uniqueValues(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

// eslint-disable-next-line func-names
module.exports = function (plop) {
  const date = new Date();
  const displayMonth = String(date.getMonth() + 1).padStart(2, '0');
  const displayYear = date.getFullYear();
  const contentRoot = path.join(__dirname, '..', 'content', 'blog');
  const contentDirectory = path.join(contentRoot, String(displayYear), displayMonth);
  const imagesDirectory = path.join(contentDirectory, 'images');
  const imagesFolderExists = fs.existsSync(imagesDirectory);
  const { categories, tags } = collectTaxonomyChoices(contentRoot);
  const categoryChoices = [
    ...categories,
    { name: 'Add New Category', value: NEW_CATEGORY_VALUE },
  ];

  plop.setActionType('addFolder',
      (answers, config) => fs.promises.mkdir(config.path, { recursive: true }));

  plop.setGenerator('post', {
    description: 'blog post template',
    prompts: [
      {
        type: 'input',
        name: 'title',
        message: 'Title:',
      },
      {
        type: 'list',
        name: 'categorySelection',
        message: 'Category?',
        choices: categoryChoices,
        default: categories[0]?.value || NEW_CATEGORY_VALUE,
      },
      {
        type: 'input',
        name: 'newCategory',
        message: 'New category?',
        when(answers) {
          return answers.categorySelection === NEW_CATEGORY_VALUE;
        },
        filter: normalizeTaxonomyValue,
        validate(value) {
          return normalizeTaxonomyValue(value) ? true : 'Enter a category value.';
        },
      },
      {
        type: 'checkbox',
        name: 'selectedTags',
        message: 'Tags?',
        choices: tags,
      },
      {
        type: 'input',
        name: 'additionalTags',
        message: 'Additional tags? (comma-separated, optional)',
      },
      {
        type: 'confirm',
        name: 'hasImages',
        message: 'Create `/images` folder?',
        when() {
          return !imagesFolderExists;
        },
      },
    ],
    actions(data) {
      const actions = [];
      const slug = slugify(data.title, { lower: true, strict: true });
      const category = data.categorySelection === NEW_CATEGORY_VALUE ?
        data.newCategory :
        data.categorySelection;
      const tagsList = uniqueValues([
        ...(data.selectedTags || []),
        ...parseAdditionalTags(data.additionalTags),
      ]);

      if (data.hasImages) {
        actions.push({
          type: 'addFolder',
          path: imagesDirectory,
        });
      }

      actions.push({
        type: 'add',
        path: path.join(contentDirectory, `${slug}.md`),
        templateFile: path.join(__dirname, 'templates', 'post.txt'),
        data: {
          category: escapeSingleQuotedYaml(category),
          date: date.toISOString(),
          slug: `${displayYear}/${displayMonth}/${slug}`,
          tags: formatYamlStringArray(tagsList),
        },
      });

      return actions;
    },
  });
};
