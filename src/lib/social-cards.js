import {readFile} from 'node:fs/promises';
import path from 'node:path';
import satori from 'satori';
import sharp from 'sharp';

/*
 * Social cards: the 1200x630 images a page's link shows when it's shared.
 * Each is laid out with satori, which turns the text into SVG paths, then
 * flattened to a PNG by sharp. See docs/social-cards.md.
 */

export const CARD_WIDTH = 1200;
export const CARD_HEIGHT = 630;

// Resolved from the project root: bundled pages don't run from src/.
const POSES = path.resolve('src/assets/images/emojis/250');
export const PORTRAIT =
  path.resolve('src/assets/images/portrait-transparent.png');
const FONTS = path.resolve('src/assets/fonts');

// The site's light theme, from src/assets/styles/main.scss.
const COLOUR = {
  bg: '#f6f4ef',
  line: '#e0dad0',
  ink: '#1a1f1e',
  ink2: '#4a453d',
  muted: '#6d675e',
  faint: '#8f8779',
  accent: '#0b6b57',
  accentTint: '#e6efeb',
  post: '#6f4a7a',
  note: '#955d17',
  find: '#415966',
};

export function cardPath(name) {
  return `/og/${name}.png`;
}

export function posePath(pose) {
  return path.join(POSES, `${pose}.png`);
}

let fonts;

function loadFonts() {
  // Static instances of the site's variable fonts, as satori can't read
  // woff2 or pick an optical size: Display for headings, Subhead for text.
  fonts ??= Promise.all([
    ['Serif', 400, 'source-serif-4-subhead-400.ttf'],
    ['Serif', 600, 'source-serif-4-display-600.ttf'],
    ['Mono', 400, 'ibm-plex-mono-400.ttf'],
  ].map(async ([name, weight, file]) => ({
    name,
    weight,
    style: 'normal',
    data: await readFile(path.join(FONTS, file)),
  })));

  return fonts;
}

/* Art resized to fit a box, as a data URI with the size satori needs. */
async function art(file, width, height) {
  const {data, info} = await sharp(file)
      .resize({width, height, fit: 'inside'})
      .png()
      .toBuffer({resolveWithObject: true});

  return {
    src: `data:image/png;base64,${data.toString('base64')}`,
    width: info.width,
    height: info.height,
  };
}

/* A satori element. Every box is a flex box, which satori requires. */
function h(type, style, ...children) {
  const kids = children.flat().filter(child => child || child === 0);

  return {
    type,
    props: {
      style: type === 'div' ? {display: 'flex', ...style} : style,
      children: kids.length === 1 ? kids[0] : kids,
    },
  };
}

function img(image, style) {
  return {type: 'img', props: {...image, style}};
}

const mono = (size, colour) => ({
  fontFamily: 'Mono',
  fontSize: size,
  color: colour,
  letterSpacing: size * 0.18,
  textTransform: 'uppercase',
});

function crumb(parts) {
  return h('div', {...mono(18, COLOUR.accent), position: 'absolute',
    left: 80, top: 62},
  parts.map((part, index) => h('span', {},
      index ? h('span', {color: COLOUR.faint}, ' / ') : null,
      part)));
}

function badge(label, colour) {
  return h('div', {...mono(16, '#fff'), background: colour,
    padding: '8px 14px'}, label);
}

const floor = () => h('div', {position: 'absolute', left: 0, right: 0,
  bottom: 0, height: 14, background: COLOUR.accent});

function frame(...children) {
  return h('div', {width: CARD_WIDTH, height: CARD_HEIGHT,
    position: 'relative', background: COLOUR.bg, color: COLOUR.ink,
    fontFamily: 'Serif'}, ...children);
}

/*
 * A top-level page: the masthead, with one of the avatar's poses (or the
 * portrait) standing on the green floor.
 */
export async function pageCard({crumbs, title, sub, lead, badges = [],
  art: file, artWidth = 400}) {
  const figure = await art(file, artWidth, 520);

  return render(frame(
      crumb(crumbs),
      h('div', {position: 'absolute', left: 80, top: 108, width: 640,
        flexDirection: 'column'},
      h('div', {fontSize: 92, fontWeight: 600, lineHeight: 1.05}, title),
      sub ? h('div', {...mono(19, COLOUR.muted), marginTop: 24}, sub) : null,
      lead ? h('div', {fontSize: 42, lineHeight: 1.25, color: COLOUR.ink2,
        marginTop: 30}, lead) : null,
      badges.length ? h('div', {marginTop: 34, gap: 12},
          badges.map(([label, colour]) => badge(label, colour))) : null),
      img(figure, {position: 'absolute', right: 60, bottom: 0}),
      floor(),
  ));
}

function titleSize(title) {
  if (title.length <= 12) {
    return 84;
  }
  if (title.length <= 28) {
    return 72;
  }

  return title.length <= 44 ? 64 : 58;
}

/*
 * Title and summary share the room above the byline: the more lines the
 * title takes, the fewer the summary gets. Satori can't report how a title
 * wrapped, so estimate it from an average glyph width of half the size.
 */
function lineBudget(title, size) {
  const titleLines = Math.min(3, Math.ceil(title.length * size * 0.5 / 600));

  return {titleLines, summaryLines: 5 - titleLines};
}

/* Text cut to whole lines with an ellipsis; satori only clamps a block. */
const clamped = lines => ({display: 'block', lineClamp: lines});

/*
 * A library item or project: its badge and meta, title and summary beside
 * its featured image, signed with the waving avatar.
 */
export async function itemCard({crumbs, label, colour, meta, title, summary,
  art: file, framed = false}) {
  const size = titleSize(title);
  const {titleLines, summaryLines} = lineBudget(title, size);
  const [figure, avatar] = await Promise.all([
    art(file, framed ? 450 : 430, framed ? 440 : 430),
    art(posePath('wave'), 56, 56),
  ]);
  const picture = framed ?
    img(figure, {border: `2px solid ${COLOUR.line}`, borderRadius: 6,
      boxShadow: '0 6px 24px rgba(26, 31, 30, 0.12)'}) :
    img(figure, {});

  return render(frame(
      crumb(crumbs),
      h('div', {position: 'absolute', left: 80, top: 108, width: 600,
        flexDirection: 'column'},
      h('div', {alignItems: 'center', gap: 16, marginBottom: 22},
          badge(label, colour),
          meta ? h('div', mono(16, COLOUR.muted), meta) : null),
      h('div', {...clamped(titleLines), fontSize: size, fontWeight: 600,
        lineHeight: 1.05}, title),
      summary ? h('div', {...clamped(summaryLines), fontSize: 28,
        lineHeight: 1.3, color: COLOUR.ink2, marginTop: 28}, summary) :
        null),
      h('div', {position: 'absolute', right: 50, top: 70, bottom: 84,
        width: 450, alignItems: 'center', justifyContent: 'center'}, picture),
      h('div', {position: 'absolute', left: 80, bottom: 44,
        alignItems: 'center', gap: 14, fontSize: 17, color: COLOUR.ink2},
      img(avatar, {borderRadius: 28, background: COLOUR.accentTint}),
      'Seán McNamara'),
      floor(),
  ));
}

export const TYPE_COLOUR = {
  post: COLOUR.post,
  note: COLOUR.note,
  find: COLOUR.find,
  project: COLOUR.accent,
};

async function render(element) {
  const svg = await satori(element, {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    fonts: await loadFonts(),
  });

  return sharp(Buffer.from(svg)).png({palette: true, quality: 90}).toBuffer();
}
