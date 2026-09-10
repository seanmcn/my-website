import fs from 'fs/promises';
import path from 'path';
import process from 'process';
import {
  OPENAI_CHAT_URL,
  parseArgs,
  loadRepoEnv,
  ensureBlogPostPath,
  buildVariationKey,
  buildImagePrompt,
  generateImage,
  updateFrontmatterFields,
  saveGeneratedImage,
  parseSimpleFrontmatter,
  stripFrontmatter,
  listAllBlogPosts,
} from './lib/featured-image-core.mjs';

// The only two styles/palettes we rotate through automatically. The manual
// script still supports the full set for one-off overrides.
const AUTO_STYLES = ['mascot-cartoon', 'chibi-cartoon'];
const AUTO_PALETTES = ['balanced', 'bright'];
const RECENT_POST_LIMIT = 8;
const RECENT_CONCEPT_LIMIT = 6;
const BODY_EXCERPT_LIMIT = 3000;
const TEXT_MODEL = 'gpt-5';

function otherOf(list, current) {
  const index = list.indexOf(current);
  if (index === -1) {
    return list[0];
  }
  return list[(index + 1) % list.length];
}

function excerptBody(markdown) {
  const plain = markdown
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/[#>*_`~-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  return plain.slice(0, BODY_EXCERPT_LIMIT);
}

async function loadRecentPosts(repoRoot, excludePostPath) {
  const allPostPaths = await listAllBlogPosts(repoRoot);
  const posts = [];

  for (const postPath of allPostPaths) {
    if (postPath === excludePostPath) {
      continue;
    }

    let contents;
    try {
      contents = await fs.readFile(postPath, 'utf8');
    } catch {
      continue;
    }

    const frontmatter = parseSimpleFrontmatter(contents);
    if (!frontmatter || !frontmatter.date) {
      continue;
    }

    const timestamp = Date.parse(frontmatter.date);
    if (Number.isNaN(timestamp)) {
      continue;
    }

    posts.push({postPath, frontmatter, timestamp});
  }

  posts.sort((a, b) => b.timestamp - a.timestamp);

  return posts.slice(0, RECENT_POST_LIMIT);
}

async function buildConceptPrompt(apiKey, targetFrontmatter, bodyExcerpt, recentConcepts) {
  const recentConceptsBlock = recentConcepts.length > 0 ?
    recentConcepts.map(concept => `- ${concept}`).join('\n') :
    '- (no recent history yet)';

  const systemPrompt = `You write a single, concrete visual concept for a blog post's featured cartoon illustration.

Given the post's metadata and content, respond with ONE short sentence (max ~25 words) describing a specific visual scene, subject, or object that captures the post's core idea.

Rules:
- Be concrete and specific to this post's actual content, not generic tech-blog imagery.
- Avoid generic motifs like floating gears, light bulbs, generic humanoid robots, dashboards, clouds, or gears unless truly central to the post's subject.
- The concept must not require rendering any text, letters, numbers, code, symbols, UI, or screen contents in the image — AI image generation reliably mangles text, so never describe a scene that depends on legible words, code snippets, logos, signage, or labels (e.g. no "code-printed" objects, no screens showing content, no captions). If the post is about code or text, represent it through objects, gestures, or abstract shapes instead of by showing any actual text.
- Do not mention colour, palette, or art style — that is handled separately.
- Do not repeat the visual subjects/concepts listed under "Recent illustration concepts to avoid repeating".
- Output ONLY the concept sentence. No preamble, no quotes, no trailing period required.`;

  const userPrompt = `Post title: ${targetFrontmatter.title || '(untitled)'}
Post type: ${targetFrontmatter.type || 'post'}
Category: ${targetFrontmatter.category || '(none)'}
Summary: ${targetFrontmatter.summary || '(none)'}

Post content excerpt:
${bodyExcerpt}

Recent illustration concepts to avoid repeating:
${recentConceptsBlock}`;

  let response;
  try {
    response = await fetch(OPENAI_CHAT_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: TEXT_MODEL,
        messages: [
          {role: 'system', content: systemPrompt},
          {role: 'user', content: userPrompt},
        ],
      }),
    });
  } catch (error) {
    throw new Error(`Unable to reach OpenAI chat API: ${error.message}`);
  }

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error?.message || 'OpenAI chat completion failed.');
  }

  const concept = payload?.choices?.[0]?.message?.content?.trim();

  if (!concept) {
    throw new Error('OpenAI did not return a concept prompt.');
  }

  return concept.replace(/^["']|["']$/g, '');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const repoRoot = process.cwd();

  if (!args.file) {
    throw new Error('Missing required --file argument.');
  }

  const postPath = path.resolve(repoRoot, args.file);
  const normalizedPostPath = ensureBlogPostPath(postPath, repoRoot);
  const envValues = await loadRepoEnv(repoRoot);
  const apiKey = process.env.OPENAI_API_KEY || envValues.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY was not found in the environment or .env.');
  }

  const contents = await fs.readFile(postPath, 'utf8');
  const targetFrontmatter = parseSimpleFrontmatter(contents);

  if (!targetFrontmatter) {
    throw new Error('The post does not contain a YAML frontmatter block.');
  }

  const bodyExcerpt = excerptBody(stripFrontmatter(contents));
  const recentPosts = await loadRecentPosts(repoRoot, postPath);

  const lastStyle = recentPosts.find(post => AUTO_STYLES.includes(post.frontmatter.featuredStyle))
      ?.frontmatter.featuredStyle;
  const lastPalette = recentPosts.find(post => AUTO_PALETTES.includes(post.frontmatter.featuredPalette))
      ?.frontmatter.featuredPalette;

  const internalStyle = lastStyle ? otherOf(AUTO_STYLES, lastStyle) : AUTO_STYLES[0];
  const paletteMode = lastPalette ? otherOf(AUTO_PALETTES, lastPalette) : AUTO_PALETTES[0];

  const recentConcepts = recentPosts
      .map(post => post.frontmatter.featuredPrompt)
      .filter(Boolean)
      .slice(0, RECENT_CONCEPT_LIMIT);

  console.log(`Generating featured image for ${normalizedPostPath}`);
  console.log(`Auto style: ${internalStyle} (previous: ${lastStyle || 'none'})`);
  console.log(`Auto palette: ${paletteMode} (previous: ${lastPalette || 'none'})`);

  const prompt = await buildConceptPrompt(apiKey, targetFrontmatter, bodyExcerpt, recentConcepts);
  console.log(`Generated concept prompt: ${prompt}`);

  const postBaseName = path.basename(postPath, path.extname(postPath));
  const variationKey = buildVariationKey(normalizedPostPath, postBaseName, prompt);
  const imageBuffer = await generateImage(apiKey, buildImagePrompt(prompt, variationKey, paletteMode, internalStyle));

  const {outputFilePath, featuredValue} = await saveGeneratedImage(repoRoot, postPath, imageBuffer);

  await updateFrontmatterFields(postPath, [
    ['featured', featuredValue],
    ['featuredStyle', internalStyle],
    ['featuredPalette', paletteMode],
    ['featuredPrompt', prompt],
  ]);

  console.log(`Saved image to ${path.relative(repoRoot, outputFilePath)}`);
  console.log(`Updated featured frontmatter to '${featuredValue}'`);
}

main().catch(error => {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
});
