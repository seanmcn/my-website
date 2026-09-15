import React from 'react';
import PropTypes from 'prop-types';

/*
 * A correction or caveat framed apart from the main argument, distinct from
 * the pull-quote blockquote already in use. Can hold a Steps list as well as
 * prose. See src/assets/styles/content.scss for the tabbed-label styling.
 */
export const Note = ({children}) => (
  <aside className="noteAside">
    <span className="noteAside__label">Note</span>
    {children}
  </aside>
);

Note.propTypes = {
  children: PropTypes.node,
};
