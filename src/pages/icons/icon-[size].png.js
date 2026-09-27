import {ICON_SIZES, iconResponse} from '../../lib/site-icons.js';

export function getStaticPaths() {
  return ICON_SIZES.map(size => ({params: {size: `${size}x${size}`}}));
}

export function GET({params}) {
  return iconResponse(Number(params.size.split('x')[0]));
}
