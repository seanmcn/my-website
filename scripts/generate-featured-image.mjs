import fs from 'fs/promises';
import path from 'path';
import process from 'process';

const OPENAI_IMAGES_URL = 'https://api.openai.com/v1/images/generations';
const SUPPORTED_EXTENSIONS = new Set(['.md', '.mdx']);
const PALETTE_MODES = new Set(['pastel', 'balanced', 'bright']);
const INTERNAL_STYLES = new Set([
  'basic-cartoon',
  'mascot-cartoon',
  'chibi-cartoon',
  'cozy-cartoon-scene',
]);
const BASE_STYLE_PROMPT = `Create a distinctive editorial illustration for a blog post.

Global requirements:
- High resolution
- Transparent background
- No text unless explicitly requested
- Clean silhouette and readable subject at card size
- Match the concept directly instead of defaulting to generic SaaS illustration motifs
- Keep the overall look cartoon editorial, not realistic
- Some illustrations can feel cute and soft, but others should feel sharper, cleaner, or more graphic
- Only include decorative background elements when they reinforce the concept`;
const PASTEL_PALETTE_VARIATIONS = [
  'Pastel palette led by mint and teal, with peach and cream accents.',
  'Pastel palette led by sky blue and lavender, with mint accents.',
  'Pastel palette led by peach and apricot, with teal accents.',
  'Pastel palette led by sage green and seafoam, with soft coral accents.',
  'Pastel palette led by powder blue and soft coral, with lilac accents.',
];
const BALANCED_PALETTE_VARIATIONS = [
  'Balanced palette led by teal and soft blue, with coral accents. More saturated than pastel, but still soft and editorial.',
  'Balanced palette led by blue and lavender, with mint accents. Fresh and clear, without looking neon.',
  'Balanced palette led by apricot and coral, with teal accents. Warm and colourful, but still gentle.',
  'Balanced palette led by sage and turquoise, with coral accents. Richer than pastel, but not loud.',
  'Balanced palette led by blue and coral, with lilac accents. Clean, colourful, and restrained rather than vivid.',
];
const BRIGHT_PALETTE_VARIATIONS = [
  'Bright palette led by teal and azure with coral accents. Noticeably more saturated than balanced, but still soft-edged and editorial rather than poster-like.',
  'Bright palette led by cobalt and periwinkle with mint accents. Clear and colourful, but avoid neon intensity.',
  'Bright palette led by orange and coral with turquoise accents. Energetic and warm, but keep the overall finish gentle.',
  'Bright palette led by emerald and aqua with coral accents. Fresh and lively, while staying controlled and not loud.',
  'Bright palette led by blue and coral with lilac accents. Punchier than balanced, but still polished and restrained.',
];
const CHARACTER_VARIATIONS = [
  'Use no character unless a character clearly improves the concept. Prefer objects or symbolic elements when they tell the story better.',
  'Include a stylised cartoon character only if it helps communicate the concept. The character should feel contemporary and expressive, not mascot-like. Default to a male-presenting character unless the prompt explicitly asks for a woman or feminine presentation.',
  'Use a cartoon character as the main subject, with a confident pose and clearer anatomy than a toy-like chibi figure. Default to a male-presenting character unless the prompt explicitly asks for a woman or feminine presentation.',
  'Use a softer, friendlier cartoon character with a slightly cute expression, but avoid babyish proportions. Default to a male-presenting character unless the prompt explicitly asks for a woman or feminine presentation.',
];
const FINISH_VARIATIONS = [
  'Render as crisp cartoon illustration with subtle depth, limited gloss, and clean shapes.',
  'Render as soft matte illustration with gentle gradients, but avoid a clay toy appearance.',
  'Render as polished cartoon 3D with simplified materials and restrained softness.',
  'Render as graphic cartoon artwork with slightly flatter surfaces and stronger shape definition.',
];
const COMPOSITION_VARIATIONS = [
  'Prefer a single strong focal subject and minimal filler elements.',
  'Use an asymmetrical composition with one dominant subject and one supporting detail.',
  'Use a balanced composition, but avoid the subject feeling too centered and template-like.',
  'Let the composition breathe with negative space, while keeping the main concept visually specific.',
];
const STYLE_PROMPTS = {
  'basic-cartoon': `Style direction: Basic Cartoon
- Modern cartoon editorial illustration for blog cards
- Contemporary shapes, clean forms, and readable silhouette
- Can use a character, object, or symbolic concept depending on the prompt
- Avoid excessive cuteness unless the concept calls for it
- Keep the rendering polished, simple, and versatile`,
  'mascot-cartoon': `Style direction: Mascot Cartoon
- Cute mascot-style cartoon illustration with rounded forms and friendly expression
- Best for anthropomorphic animals, objects, devices, or surreal concept characters
- Large expressive eyes, simplified limbs, soft outlines, and gentle shading
- White or very minimal background, tiny ground shadow, centered subject
- Keep it charming and whimsical, but not clay-like or plasticky`,
  'chibi-cartoon': `Style direction: Chibi Cartoon
- Chibi-inspired cartoon character with oversized head and smaller body
- Clear facial features, lively pose, and playful expression
- Crisp linework or edge definition, soft shading, and clean colour blocking
- Best for people-centric concepts where a single cartoon person should carry the image
- Cute and stylised, but still neat and polished rather than toy-like`,
  'cozy-cartoon-scene': `Style direction: Cozy Cartoon Scene
- Warm cartoon illustration with a small character inside a simple environment
- Include a few environmental details that support the story: desk, shelves, room elements, props
- Friendly, slightly storybook feel with soft lighting and a more lived-in composition
- Best for posts that benefit from a scene rather than a single floating subject
- Keep it cute and approachable, but still visually clean at card size`,
};

function hashString(value) {
  let hash = 0;

  for (let i = 0; i < value.length; i += 1) {
    hash = ((hash << 5) - hash) + value.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash);
}

function pickAutoStyle(variationKey, paletteMode) {
  const palettes = paletteMode === 'bright' ?
    BRIGHT_PALETTE_VARIATIONS :
    paletteMode === 'balanced' ?
      BALANCED_PALETTE_VARIATIONS :
      PASTEL_PALETTE_VARIATIONS;

  return {
    palette: palettes[hashString(`${variationKey}:palette`) % palettes.length],
    character: CHARACTER_VARIATIONS[hashString(`${variationKey}:character`) % CHARACTER_VARIATIONS.length],
    finish: FINISH_VARIATIONS[hashString(`${variationKey}:finish`) % FINISH_VARIATIONS.length],
    composition: COMPOSITION_VARIATIONS[hashString(`${variationKey}:composition`) % COMPOSITION_VARIATIONS.length],
  };
}

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

function buildVariationKey(postPath, postBaseName, userPrompt) {
  return `${postPath}::${postBaseName}::${userPrompt.trim().toLowerCase()}`;
}

function buildImagePrompt(userPrompt, variationKey, paletteMode, internalStyle) {
  const variation = pickAutoStyle(variationKey, paletteMode);
  const stylePrompt = STYLE_PROMPTS[internalStyle];

  return `${BASE_STYLE_PROMPT}

${stylePrompt}

Style variation:
- Internal style: ${internalStyle}
- Palette mode: ${paletteMode}
- ${variation.palette}
- ${variation.character}
- ${variation.finish}
- ${variation.composition}
- Avoid recurring generic motifs like floating spheres, cubes, or dashboard panels unless the concept explicitly calls for them
- When a human character is used, default to male-presenting unless the prompt explicitly requests female or another presentation
- Vary face shape, hairstyle, body proportions, pose, and clothing when characters are used

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
  const paletteMode = args.palette?.trim().toLowerCase() || 'pastel';
  const internalStyle = args.style?.trim().toLowerCase() || 'basic-cartoon';

  if (!args.file) {
    throw new Error('Missing required --file argument.');
  }

  if (!prompt) {
    throw new Error('Missing required --prompt argument.');
  }

  if (!PALETTE_MODES.has(paletteMode)) {
    throw new Error(`Invalid --palette value '${paletteMode}'. Valid options: ${Array.from(PALETTE_MODES).join(', ')}`);
  }

  if (!INTERNAL_STYLES.has(internalStyle)) {
    throw new Error(`Invalid --style value '${internalStyle}'. Valid options: ${Array.from(INTERNAL_STYLES).join(', ')}`);
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
  console.log(`Style: ${internalStyle}`);
  console.log(`Palette: ${paletteMode}`);

  const variationKey = buildVariationKey(normalizedPostPath, postBaseName, prompt);
  const imageBuffer = await generateImage(apiKey, buildImagePrompt(prompt, variationKey, paletteMode, internalStyle));

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
