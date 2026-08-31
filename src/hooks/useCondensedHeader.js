import React from 'react';

/*
 * True once the page has scrolled past the header. Several pieces of chrome
 * react to it: the sticky item bar shrinks its title, and the about portrait
 * pulls in so the rail keeps up with the article beside it.
 */
export default function useCondensedHeader(threshold = 40) {
  const [condensed, setCondensed] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      const offset = Math.max(
          window.scrollY || 0,
          document.scrollingElement?.scrollTop || 0,
      );

      setCondensed((previous) => {
        const next = offset > threshold;

        return next === previous ? previous : next;
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});

    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return condensed;
}
