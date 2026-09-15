import React from 'react';
import PropTypes from 'prop-types';

const COLORS = ['amber', 'blue', 'plum', 'rose', 'sky', 'moss', 'green'];

// A handful of fixed tilts, alternating direction, so a page of notes reads
// as scattered rather than uniformly leaning one way.
const TILTS = [1.6, -1.6, 2.2, -2.2];

function tiltFor(index) {
  return TILTS[index % TILTS.length];
}

function NoteBody({children, label, marker}) {
  return (
    <>
      <div className="stickyNote__label">
        {marker && <span className="stickyNote__marker">{marker}</span>}
        {label}
      </div>
      <p className="stickyNote__text">{children}</p>
    </>
  );
}

NoteBody.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string,
  marker: PropTypes.string,
};

/*
 * A single sticky note: a torn-paper aside that floats beside the paragraph
 * it annotates, tilted like it's actually stuck to the page. Group two or
 * more inside StickyStack instead of using this directly to get a stack with
 * older notes peeking out from behind the top one.
 */
export const StickyNote = ({children, color, label, marker, tilt}) => (
  <aside
    className={`stickyNote stickyNote--${color}`}
    id={marker ? `sticky-${marker}` : undefined}
    style={{'--stickyTilt': `${tilt ?? tiltFor(0)}deg`}}
  >
    <span aria-hidden="true" className="stickyNote__tape" />
    <NoteBody label={label} marker={marker}>{children}</NoteBody>
  </aside>
);

StickyNote.propTypes = {
  children: PropTypes.node,
  color: PropTypes.oneOf(COLORS),
  label: PropTypes.string,
  marker: PropTypes.string,
  tilt: PropTypes.number,
};

StickyNote.defaultProps = {
  color: 'amber',
  label: 'Note',
};

/*
 * An inline, footnote-style marker dropped into running text, matching the
 * colour of the StickyNote it points at (give that note the same `n` as its
 * `marker` prop, so it carries a matching numbered badge and a landing id).
 * Deliberately just an anchor link rather than a click-to-select control:
 * a standalone note has nothing to select between, and wiring it into
 * StickyStack's active-note state isn't worth the coupling for what is,
 * on this site, a footnote pointing at one specific note.
 */
export const StickyRef = ({color, n}) => (
  <a
    aria-label={`Jump to note ${n}`}
    className={`stickyRef stickyRef--${color}`}
    href={`#sticky-${n}`}
  >
    {n}
  </a>
);

StickyRef.propTypes = {
  color: PropTypes.oneOf(COLORS),
  n: PropTypes.string.isRequired,
};

StickyRef.defaultProps = {
  color: 'amber',
};

/*
 * Two or more StickyNote children, stacked like real paper: the rest peek
 * out from behind the active one, and the arrows cycle through them. Ghost
 * copies of every note are rendered hidden in the same grid cell purely so
 * the stack's height matches whichever note is tallest, rather than jumping
 * as you click through short and long ones. A single child skips all of
 * that and renders as a plain StickyNote.
 */
export const StickyStack = ({children}) => {
  const notes = React.Children.toArray(children).filter(React.isValidElement);
  const count = notes.length;
  const [active, setActive] = React.useState(0);

  if (count <= 1) {
    return notes[0] || null;
  }

  const goTo = index => setActive(((index % count) + count) % count);
  const activeNote = notes[active];
  const activeColor = activeNote.props.color || 'amber';

  return (
    <div className="stickyStack">
      {notes.map((note, i) => (
        <div
          aria-hidden="true"
          className="stickyStack__ghost"
          key={`ghost-${i}`}
        >
          <NoteBody label={note.props.label} marker={note.props.marker}>
            {note.props.children}
          </NoteBody>
        </div>
      ))}

      <div className="stickyStack__wrap">
        {notes.map((note, i) => {
          const depth = (i - active + count) % count;

          if (depth === 0) {
            return null;
          }

          const rearColor = note.props.color || 'amber';

          return (
            <div
              className={`stickyStack__rear stickyNote--${rearColor}`}
              key={`rear-${i}`}
              style={{
                '--stickyRearDepth': depth,
                '--stickyTilt': `${tiltFor(i)}deg`,
              }}
            />
          );
        })}

        <div
          className={`stickyStack__note stickyNote--${activeColor}`}
          style={{'--stickyTilt': `${tiltFor(active)}deg`}}
        >
          <span aria-hidden="true" className="stickyNote__tape" />
          <NoteBody
            label={activeNote.props.label}
            marker={activeNote.props.marker}
          >
            {activeNote.props.children}
          </NoteBody>
          <div className="stickyStack__counter">
            <button
              aria-label="Previous note"
              className="stickyStack__arrow"
              onClick={() => goTo(active - 1)}
              type="button"
            >
              &#8592;
            </button>
            <span>{active + 1} / {count}</span>
            <button
              aria-label="Next note"
              className="stickyStack__arrow"
              onClick={() => goTo(active + 1)}
              type="button"
            >
              &#8594;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

StickyStack.propTypes = {
  children: PropTypes.node,
};
