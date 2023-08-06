import React from 'react';
import PropTypes from 'prop-types';
import {icon} from '@fortawesome/fontawesome-svg-core/import.macro';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const TimelineItem = ({title, content, type}) => {
  const iconElement =
    type === 'work' ? (
      <FontAwesomeIcon icon={icon({name: 'briefcase'})} />
    ) : (
      <FontAwesomeIcon icon={icon({name: 'plane'})} />
    );

  return (
    <div className="timeline-item">
      <div className="timeline-marker is-icon">{iconElement}</div>
      <div className="timeline-content">
        <p className="heading">{title}</p>
        <p>{content}</p>
      </div>
    </div>
  );
};

TimelineItem.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default TimelineItem;
