/*
 * Responsive sizes for each place an image shows: the widths to generate, and
 * the `sizes` hint telling the browser how wide the image displays, so it can
 * fetch the smallest file that's still sharp on that screen.
 *
 * The hints follow the layout CSS at its two breakpoints (narrow up to 759px,
 * mid up to 1079px, then wide; see src/assets/styles/tokens.scss). Widths
 * allow for the root font size growing to 18px on large screens. When a
 * slot's CSS width changes, update its hint here:
 * tests/e2e/responsive-images.spec.js fails when a hint has drifted far
 * enough to serve blurry or oversized files.
 *
 * Astro never upscales: widths above an image's own width collapse to it.
 */
const NARROW = '(max-width: 759px)';
const MID = '(max-width: 1079px)';

export const IMAGE_SIZES = {
  // Images in a post's body fill the text column.
  prose: {
    widths: [480, 720, 960, 1280, 1760],
    sizes: `${NARROW} 100vw, ${MID} calc(100vw - 5rem), 880px`,
  },
  // A post's featured image: full width when narrow, then floated beside the
  // text.
  featured: {
    widths: [360, 540, 720, 1080],
    sizes: `${NARROW} 100vw, ${MID} 28vw, 350px`,
  },
  // Square thumbnails on the home page's latest posts.
  homeLead: {
    widths: [110, 220, 330, 440],
    sizes: `${NARROW} calc(34vw - 32px), ${MID} 14vw, 106px`,
  },
  // The small project thumbnails further down the home page.
  homeProject: {
    widths: [96, 192, 288],
    sizes: '96px',
  },
  // Square thumbnails in library listings.
  libraryRow: {
    widths: [140, 200, 280, 410, 520],
    sizes: `${NARROW} calc(37vw - 24px), ${MID} 99px, 140px`,
  },
  // Thumbnails in the projects list.
  projectRow: {
    widths: [116, 144, 232],
    sizes: `${NARROW} 72px, 116px`,
  },
  // The strip of screenshots under a project's main image.
  projectStrip: {
    widths: [116, 140, 232],
    sizes: `${NARROW} 70px, 116px`,
  },
  // The project card in a post's rail, a fixed 5.5rem wide.
  projectCard: {
    widths: [100, 200, 300],
    sizes: '99px',
  },
  // Related items in a post's rail, which only shows them below wide.
  related: {
    widths: [170, 340, 680],
    sizes: `(max-width: 359px) 290px, ${NARROW} 230px, 330px`,
  },
};

/*
 * A project's main screenshot fits (object-fit: contain) inside a box up to
 * 900px wide whose height follows the window: clamp(11.875rem, 32vh,
 * 22.5rem) less its 0.875rem padding, about 162px to 374px. How wide the
 * image shows depends on its shape, so a tall phone screenshot needs far
 * fewer pixels than a wide desktop one. Browsers that can't read min() or
 * clamp() here fall back to the full screen width: larger, never blurry.
 */
export function projectStageSizes(image) {
  const aspect = (image.width / image.height).toFixed(3);

  return {
    widths: [480, 720, 1000, 1400, 1800],
    sizes: 'min(100vw, 900px, ' +
      `calc(clamp(162px, 32vh - 28px, 374px) * ${aspect}))`,
  };
}
