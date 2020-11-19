import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ link, content }) => (
  <a className="box" href={link}>
    {content}
  </a>
);

Button.propTypes = {
  link: PropTypes.string.isRequired,
  content: PropTypes.element.isRequired,
};

export default Button;
