import path from 'path';
import process from 'process';
import {
  PALETTE_MODES,
  INTERNAL_STYLES,
  parseArgs,
  loadRepoEnv,
  ensureBlogPostPath,
  buildVariationKey,
  buildImagePrompt,
  generateImage,
  updateFrontmatterFields,
  saveGeneratedImage,
} from './lib/featured-image-core.mjs';

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

  console.log(`Generating featured image for ${normalizedPostPath}`);
  console.log(`Prompt: ${prompt}`);
  console.log(`Style: ${internalStyle}`);
  console.log(`Palette: ${paletteMode}`);

  const postBaseName = path.basename(postPath, path.extname(postPath));
  const variationKey = buildVariationKey(normalizedPostPath, postBaseName, prompt);
  const imageBuffer = await generateImage(apiKey, buildImagePrompt(prompt, variationKey, paletteMode, internalStyle));

  const {outputFilePath, featuredValue} = await saveGeneratedImage(repoRoot, postPath, imageBuffer);

  await updateFrontmatterFields(postPath, [
    ['featured', featuredValue],
    ['featuredStyle', internalStyle],
    ['featuredPalette', paletteMode],
    ['featuredPrompt', prompt.trim()],
  ]);

  console.log(`Saved image to ${path.relative(repoRoot, outputFilePath)}`);
  console.log(`Updated featured frontmatter to '${featuredValue}'`);
}

main().catch(error => {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
});
