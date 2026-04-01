import fs from 'fs/promises';
import path from 'path';
import process from 'process';

const OPENAI_IMAGES_URL = 'https://api.openai.com/v1/images/generations';
const SUPPORTED_EXTENSIONS = new Set(['.md', '.mdx']);
const STYLE_PROMPT = `You are an illustration generator that produces clean, modern, playful 3D-style vector artwork.

Style guidelines:
- Soft pastel color palette (muted purples, greens, oranges, blues)
- Minimal, clean composition with lots of white negative space
- Slight isometric or 3/4 perspective
- Smooth, rounded shapes with no sharp edges
- Characters and objects are stylized, cute, and slightly exaggerated
- Materials look like soft plastic or matte clay (no realism)
- Use subtle gradients and soft ambient lighting
- Avoid hard shadows or high contrast
- Include small floating geometric elements (spheres, cubes, abstract shapes) for visual interest
- Keep details minimal and readable at small sizes
- Overall feel: friendly, modern SaaS illustration, slightly whimsical

Rendering:
- High resolution
- Centered composition
- Transparent background
- No text unless explicitly requested`;

function parseArgs(argv) {
  const args = {};

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (!arg.startsWith('--')) {
      continue;
    }

    args[arg.slice(2)] = argv[i + 1];
    i += 1;
  }

  return args;
}

function normaliseSlugSegment(input) {
  return input
      .normalize('NFKD')
      .replace(/[^\w\s-]/g, ' ')
      .trim()
      .replace(/[_\s]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase();
}

function parseDotEnv(contents) {
  const env = {};

  contents.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      return;
    }

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) {
      return;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith('\'') && value.endsWith('\''))
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  });

  return env;
}

async function loadRepoEnv(repoRoot) {
  const envPath = path.join(repoRoot, '.env');

  try {
    return parseDotEnv(await fs.readFile(envPath, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {};
    }

    throw error;
  }
}

function ensureBlogPostPath(postPath, repoRoot) {
  const extension = path.extname(postPath).toLowerCase();
  if (!SUPPORTED_EXTENSIONS.has(extension)) {
    throw new Error('The active file must be a Markdown or MDX blog post.');
  }

  const relativePath = path.relative(repoRoot, postPath);
  const normalizedPath = relativePath.split(path.sep).join('/');

  if (normalizedPath.startsWith('..') || !normalizedPath.startsWith('content/blog/')) {
    throw new Error('The active file must live under content/blog/.');
  }

  return normalizedPath;
}

function buildImagePrompt(userPrompt) {
  return `${STYLE_PROMPT}

Image concept:
${userPrompt.trim()}`;
}

async function generateImage(apiKey, prompt) {
  let response;

  try {
    response = await fetch(OPENAI_IMAGES_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt,
        size: '1024x1024',
        quality: 'medium',
        output_format: 'png',
        background: 'transparent',
        n: 1,
      }),
    });
  } catch (error) {
    throw new Error(`Unable to reach OpenAI image API: ${error.message}`);
  }

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error?.message || 'OpenAI image generation failed.');
  }

  const imageBase64 = payload?.data?.[0]?.b64_json;

  if (!imageBase64) {
    throw new Error('OpenAI did not return image data.');
  }

  return Buffer.from(imageBase64, 'base64');
}

async function updateFrontmatter(postPath, featuredValue) {
  const contents = await fs.readFile(postPath, 'utf8');
  const frontmatterMatch = contents.match(/^---\r?\n([\s\S]*?)\r?\n---/);

  if (!frontmatterMatch) {
    throw new Error('The post does not contain a YAML frontmatter block.');
  }

  const currentFrontmatter = frontmatterMatch[1];
  const nextFeaturedLine = `featured: '${featuredValue}'`;
  const nextFrontmatter = /^featured:\s*.*$/m.test(currentFrontmatter) ?
    currentFrontmatter.replace(/^featured:\s*.*$/m, nextFeaturedLine) :
    `${currentFrontmatter}\n${nextFeaturedLine}`;

  const updatedContents = contents.replace(
      /^---\r?\n[\s\S]*?\r?\n---/,
      `---\n${nextFrontmatter}\n---`,
  );

  await fs.writeFile(postPath, updatedContents, 'utf8');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const repoRoot = process.cwd();
  const prompt = args.prompt?.trim();

  if (!args.file) {
    throw new Error('Missing required --file argument.');
  }

  if (!prompt) {
    throw new Error('Missing required --prompt argument.');
  }

  const postPath = path.resolve(repoRoot, args.file);
  const normalizedPostPath = ensureBlogPostPath(postPath, repoRoot);
  const envValues = await loadRepoEnv(repoRoot);
  const apiKey = process.env.OPENAI_API_KEY || envValues.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY was not found in the environment or .env.');
  }

  const postDirectory = path.dirname(postPath);
  const imagesDirectory = path.join(postDirectory, 'images');
  const postBaseName = path.basename(postPath, path.extname(postPath));
  const outputFileName = `featured-${normaliseSlugSegment(postBaseName)}.png`;
  const outputFilePath = path.join(imagesDirectory, outputFileName);
  const featuredValue = `images/${outputFileName}`;

  console.log(`Generating featured image for ${normalizedPostPath}`);
  console.log(`Prompt: ${prompt}`);

  const imageBuffer = await generateImage(apiKey, buildImagePrompt(prompt));

  await fs.mkdir(imagesDirectory, {recursive: true});
  await fs.writeFile(outputFilePath, imageBuffer);
  await updateFrontmatter(postPath, featuredValue);

  console.log(`Saved image to ${path.relative(repoRoot, outputFilePath)}`);
  console.log(`Updated featured frontmatter to '${featuredValue}'`);
}

main().catch(error => {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
});
