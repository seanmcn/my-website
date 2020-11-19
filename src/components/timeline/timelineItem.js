import React from 'react';
import PropTypes from 'prop-types';

const TimelineItem = ({ title, content, icon }) => (
  <div className="timeline-item">
    <div className="timeline-marker is-icon">
      <i className={`fa ${icon}`} />
    </div>
    <div className="timeline-content">
      <p className="heading">{title}</p>
      <p>{content}</p>
    </div>
  </div>
);

TimelineItem.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
};

export default TimelineItem;
