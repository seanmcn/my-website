import React from 'react';
import PropTypes from 'prop-types';

const WidgetBox = ({ title, content }) => (
  <div className="box">
    <h1 className="subtitle">{title}</h1>
    <div className="content">{content}</div>
  </div>
);

WidgetBox.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.element.isRequired,
};

export default WidgetBox;
