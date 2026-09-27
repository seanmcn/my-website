/*
 * Pages that exist only under `astro dev`: the post components reference at
 * /dev/components/, which took over from Storybook.
 */
export default function devPages() {
  return {
    name: 'dev-pages',
    hooks: {
      'astro:config:setup': ({command, injectRoute}) => {
        if (command !== 'dev') {
          return;
        }

        injectRoute({
          pattern: '/dev/components',
          entrypoint: './src/dev/components.astro',
        });
      },
    },
  };
}
