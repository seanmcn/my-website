import React from 'react';
import PropTypes from 'prop-types';
import './widgetBox.scss';

const WidgetBox = ({title, content}) => (
  <div className="box widgetBox">
    <div className="widgetBoxHeader">
      <h1 className="subtitle widgetBoxTitle">{title}</h1>
    </div>
    <div className="content widgetBoxContent">{content}</div>
  </div>
);

WidgetBox.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.element.isRequired,
};

export default WidgetBox;
