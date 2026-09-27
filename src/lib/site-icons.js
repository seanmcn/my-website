import path from 'node:path';
import sharp from 'sharp';

/*
 * The favicon, touch icons and manifest icons, all resized at build time
 * from one source image, at the same addresses gatsby-plugin-manifest used.
 */
// Resolved from the project root: bundled pages don't run from src/.
export const ICON_SOURCE = path.resolve('content/assets/pwa/icon.png');

export const ICON_SIZES = [48, 72, 96, 144, 192, 256, 384, 512];

export async function iconResponse(size) {
  const png = await sharp(ICON_SOURCE)
      .resize(size, size)
      .png()
      .toBuffer();

  return new Response(png, {headers: {'Content-Type': 'image/png'}});
}
