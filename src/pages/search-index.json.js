import {getImage} from 'astro:assets';
import {searchIndexEntries} from '../lib/library.js';

/* The search screen's index: every item and project, with a thumbnail. */
export async function GET() {
  const entries = await Promise.all((await searchIndexEntries()).map(
      async ({featured, ...entry}) => ({
        ...entry,
        thumb: featured ?
          (await getImage({
            src: featured,
            width: 260,
            height: 260,
            fit: 'cover',
            position: 'top',
          })).src :
          '',
      }),
  ));

  return new Response(JSON.stringify(entries), {
    headers: {'Content-Type': 'application/json'},
  });
}
