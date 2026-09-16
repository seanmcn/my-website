import React from 'react';

// Condensing shrinks the sticky item bar's own box (its title drops from a
// possibly two-line 2.5rem heading down to one line at 1.0625rem), which
// - because the bar is `position: sticky` and sits in normal flow - shrinks
// the document's total scroll height by the same amount the moment it
// happens. On a long article that's a rounding error. On a very short one
// (little more content than the shrink itself) it's enough to yank the
// scroll position back across the condense threshold, which un-condenses,
// which grows the page again, which re-triggers it: a feedback loop that
// reads as the header flickering or the page refusing to scroll to the
// footer. Guard against it by measuring how much room the page has to
// scroll *before* anything has condensed, and simply never condensing when
// that room is too close to what the shrink itself would consume.
const MIN_SCROLLABLE_FOR_CONDENSE = 100;

// Entering and leaving "condensed" at the same scroll offset means a shrink
// that nudges the scroll position by even a pixel can retrigger itself right
// back across that one line. Enter high, only leave once scrolled back down
// near the top, so a shrink-induced wobble near the entry point can't also
// cross the exit line.
const RELEASE_OFFSET = 8;

/*
 * True once the page has scrolled past the header. Several pieces of chrome
 * react to it: the sticky item bar shrinks its title, and the about portrait
 * pulls in so the rail keeps up with the article beside it.
 */
export default function useCondensedHeader(threshold = 40) {
  const [condensed, setCondensed] = React.useState(false);
  const baselineMaxScroll = React.useRef(null);

  React.useEffect(() => {
    const onScroll = () => {
      const offset = Math.max(
          window.scrollY || 0,
          document.scrollingElement?.scrollTop || 0,
      );

      if (baselineMaxScroll.current === null) {
        const scrollHeight = document.scrollingElement?.scrollHeight || 0;
        baselineMaxScroll.current = scrollHeight - window.innerHeight;
      }

      const tooShortToCondense =
        baselineMaxScroll.current < MIN_SCROLLABLE_FOR_CONDENSE;

      setCondensed((previous) => {
        if (tooShortToCondense) {
          return previous ? false : previous;
        }

        const next = previous ? offset > RELEASE_OFFSET : offset > threshold;

        return next === previous ? previous : next;
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});

    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return condensed;
}
