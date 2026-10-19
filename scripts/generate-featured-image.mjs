import path from 'path';
import process from 'process';
import {
  PALETTE_MODES,
  INTERNAL_STYLES,
  REPO_ROOT,
  parsePostArgs,
  loadRepoEnv,
  buildVariationKey,
  buildImagePrompt,
  generateImage,
  updateFrontmatterFields,
  saveGeneratedImage,
} from './lib/featured-image-core.mjs';

const USAGE = `Usage: npm run image:manual -- <post> --prompt "<concept>" [--style <style>] [--palette <palette>]

Styles: ${Array.from(INTERNAL_STYLES).join(', ')} (default basic-cartoon)
Palettes: ${Array.from(PALETTE_MODES).join(', ')} (default pastel)`;

async function main() {
  const {values, postPath, normalizedPostPath} = parsePostArgs(USAGE, {
    prompt: {type: 'string'},
    style: {type: 'string'},
    palette: {type: 'string'},
  });
  const repoRoot = REPO_ROOT;
  const prompt = values.prompt?.trim();
  const paletteMode = values.palette?.trim().toLowerCase() || 'pastel';
  const internalStyle = values.style?.trim().toLowerCase() || 'basic-cartoon';

  if (!postPath) {
    throw new Error(`Missing the post.\n\n${USAGE}`);
  }

  if (!prompt) {
    throw new Error(`Missing required --prompt argument.\n\n${USAGE}`);
  }

  if (!PALETTE_MODES.has(paletteMode)) {
    throw new Error(`Invalid --palette value '${paletteMode}'. Valid options: ${Array.from(PALETTE_MODES).join(', ')}`);
  }

  if (!INTERNAL_STYLES.has(internalStyle)) {
    throw new Error(`Invalid --style value '${internalStyle}'. Valid options: ${Array.from(INTERNAL_STYLES).join(', ')}`);
  }

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
  const variationKey =
    buildVariationKey(normalizedPostPath, postBaseName, prompt);
  const imageBuffer = await generateImage(
      apiKey,
      buildImagePrompt(prompt, variationKey, paletteMode, internalStyle),
  );

  const {outputFilePath, featuredValue} =
    await saveGeneratedImage(repoRoot, postPath, imageBuffer);

  await updateFrontmatterFields(postPath, [
    ['featured', featuredValue],
    ['featuredStyle', internalStyle],
    ['featuredPalette', paletteMode],
    ['featuredPrompt', prompt.trim()],
  ]);

  console.log(`Saved image to ${path.relative(repoRoot, outputFilePath)}`);
  console.log(`Updated featured frontmatter to '${featuredValue}'`);
}

main().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
});
