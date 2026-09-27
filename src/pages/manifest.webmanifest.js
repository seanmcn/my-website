import {ICON_SIZES} from '../lib/site-icons.js';

export function GET() {
  return new Response(JSON.stringify({
    name: 'Seán McNamara',
    short_name: 'Sean McN',
    start_url: '/',
    background_color: '#f6f4ef',
    theme_color: '#0b6b57',
    display: 'minimal-ui',
    icons: ICON_SIZES.map(size => ({
      src: `icons/icon-${size}x${size}.png`,
      sizes: `${size}x${size}`,
      type: 'image/png',
    })),
  }), {headers: {'Content-Type': 'application/manifest+json'}});
}
