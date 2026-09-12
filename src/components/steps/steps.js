import React from 'react';
import PropTypes from 'prop-types';

/*
 * A settings path rendered as an ordered [verb, target] list instead of a
 * single chevron-joined line. Each Step is one physical action (open an app,
 * click a pane, tick a box), which reads better than flattening them into
 * one string and wraps cleanly on mobile. See src/assets/styles/content.scss
 * for the grid layout and last-step styling.
 */
export const Steps = ({children}) => (
  <ol className="steps">{children}</ol>
);

Steps.propTypes = {
  children: PropTypes.node,
};

export const Step = ({verb, children}) => (
  <li className="steps__row">
    <span className="steps__verb">
      {verb}
      <span aria-hidden="true" className="steps__connector" />
    </span>
    <span className="steps__target">{children}</span>
  </li>
);

Step.propTypes = {
  children: PropTypes.node,
  verb: PropTypes.string.isRequired,
};
