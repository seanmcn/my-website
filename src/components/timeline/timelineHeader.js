import React from 'react';
import PropTypes from 'prop-types';

const TimelineHeader = ({content}) => (
  <header className="timeline-header">
    <span className="tag is-primary">{content}</span>
  </header>
);

TimelineHeader.propTypes = {
  content: PropTypes.string.isRequired,
};

export default TimelineHeader;
