const fs = require('fs');
// eslint-disable-next-line import/no-extraneous-dependencies
const slugify = require('slugify');

// eslint-disable-next-line func-names
module.exports = function (plop) {
  const date = new Date();
  const displayMonth = String(date.getMonth() + 1).padStart(2, '0');
  const displayYear = date.getFullYear();

  const contentPath = `../content/blog/${displayYear}/${displayMonth}`;

  const categories = [
    { name: 'CSS', value: 'css' },
    { name: 'Game Development', value: 'game-development' },
    { name: 'How To', value: 'how-to' },
    { name: 'Javascript', value: 'javascript' },
    { name: 'Linux', value: 'linux' },
    { name: 'Management', value: 'management' },
    { name: 'Memes', value: 'memes' },
    { name: 'Meta', value: 'meta' },
    { name: 'News', value: 'news' },
    { name: 'Personal', value: 'personal' },
    { name: 'PHP', value: 'php' },
    { name: 'PHP Learn', value: 'php-learn' },
    { name: 'Review', value: 'review' },
    { name: 'Software', value: 'software' },
    { name: 'Work', value: 'work' },
  ];

  const tags = [
    { name: 'Apache', value: 'apache' },
    { name: 'Bash', value: 'bash' },
    { name: 'Cheat Sheet', value: 'cheat-sheet' },
    { name: 'Commands', value: 'commands' },
    { name: 'Git', value: 'git' },
    { name: 'How To', value: 'how-to' },
    { name: 'Linux', value: 'linux' },
    { name: 'Perl', value: 'perl' },
    { name: 'PHP', value: 'php' },
    { name: 'Programming', value: 'programming' },
    { name: 'Review', value: 'review' },
    { name: 'Security', value: 'security' },
  ];

  plop.setActionType('addFolder',
    (answers, config) => fs.promises.mkdir(config.path, { recursive: true }));

  // controller generator
  plop.setGenerator('post', {
    description: 'blog post template',
    prompts: [
      {
        type: 'input',
        name: 'title',
        message: 'Title: ',
      },
      {
        type: 'checkbox',
        name: 'category',
        message: 'Category?',
        choices: categories,
      },
      {
        type: 'checkbox',
        name: 'tags',
        message: 'Tags?',
        choices: tags,
      },
      {
        type: 'confirm',
        name: 'hasImages',
        message: 'Create `/images` folder?',
      },
    ],
    actions(data) {
      const actions = [];
      const slug = slugify(data.title, { lower: true });
      if (data.hasImages) {
        actions.push({
          type: 'addFolder',
          path: `${contentPath}/images`,
        });
      }

      const keywords = [];

      actions.push({
        type: 'add',
        path: `${contentPath}/${slug}.md`,
        templateFile: 'templates/post.txt',
        data: {
          date: date.toISOString(),
          keywords: JSON.stringify(keywords),
          slug: `${displayYear}/${displayMonth}/${slug}`,
        },
      });

      return actions;
    },
  });
};
