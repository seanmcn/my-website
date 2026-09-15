import React from 'react';
import PropTypes from 'prop-types';

/*
 * A settings path rendered as an ordered [verb, target] list instead of a
 * single chevron-joined line. Each Step is one physical action (open an
 * app, click a pane, tick a box), which reads better than flattening them
 * into one string and wraps cleanly on mobile. Write "Verb: target" as the
 * Step's own text; target can hold JSX like <Kbd>. See
 * src/assets/styles/content.scss for the grid layout and last-step styling.
 *
 * Verb lives in the text rather than a prop so each line is one flat run of
 * children instead of an attribute plus a separate children block. Steps
 * itself stays a plain <ol> wrapper: MDX paragraph-wraps loose text dropped
 * directly inside a custom block element, so each line needs its own <Step>
 * tag to stay a distinct JSX child rather than getting merged into one <p>.
 */
export const Steps = ({children}) => (
  <ol className="steps">{children}</ol>
);

Steps.propTypes = {
  children: PropTypes.node,
};

export const Step = ({children}) => {
  const parts = React.Children.toArray(children);
  const [first, ...rest] = parts;
  let verb = '';
  let target = parts;

  if (typeof first === 'string') {
    const split = first.indexOf(':');
    if (split !== -1) {
      verb = first.slice(0, split).trim();
      const remainder = first.slice(split + 1).replace(/^\s+/, '');
      target = remainder ? [remainder, ...rest] : rest;
    }
  }

  return (
    <li className="steps__row">
      <span className="steps__verb">
        {verb}
        <span aria-hidden="true" className="steps__connector" />
      </span>
      <span className="steps__target">{target}</span>
    </li>
  );
};

Step.propTypes = {
  children: PropTypes.node,
};
