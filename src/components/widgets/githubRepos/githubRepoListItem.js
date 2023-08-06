import React from 'react';
import PropTypes from 'prop-types';
import {icon} from '@fortawesome/fontawesome-svg-core/import.macro';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const GithubRepoListItem = ({
  id, link, description, title, language,
}) => {
  let iconElement;

  if (language === 'react') {
    iconElement =
      <FontAwesomeIcon icon={icon({name: 'react', style: 'brands'})}/>;
  } else if (language === 'js') {
    iconElement =
      <FontAwesomeIcon icon={icon({name: 'js', style: 'brands'})}/>;
  } else if (language === 'php') {
    iconElement =
      <FontAwesomeIcon icon={icon({name: 'php', style: 'brands'})}/>;
  } else if (language === 'python') {
    iconElement =
      <FontAwesomeIcon icon={icon({name: 'python', style: 'brands'})}/>;
  } else {
    // Default icon if language is not matched
    iconElement =
      <FontAwesomeIcon icon={icon({name: 'code', style: 'solid'})}/>;
  }

  return (
    <li key={id}>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={description}
        title={description}
        key={title}
      >
        {title}
      </a>
      {iconElement}
      <p className="description">{description}</p>
    </li>
  );
};

GithubRepoListItem.propTypes = {
  id: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
};

export default GithubRepoListItem;
