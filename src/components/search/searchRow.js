import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'gatsby';
import {CategoryIcon, ClockIcon} from '../icons/icons';
import {
  formatItemDate,
  slugToTitle,
  sourceHost,
  TYPE_META,
} from '../../utils/content';

const KIND_LABEL = {
  post: 'Post',
  note: 'Note',
  find: 'Find',
  project: 'Project',
};

/*
 * Search results reuse the library row's shape but are built from the flat
 * JSON index rather than GraphQL nodes, so they carry no image and lean on the
 * hatched plate instead.
 */
const SearchRow = ({highlight, item, onOpen}) => {
  const kind = item.kind || 'post';
  const colour = kind === 'project' ?
    'var(--accent)' :
    TYPE_META[kind]?.colour || 'var(--ink-2)';
  const isFind = kind === 'find';
  const isProject = kind === 'project';
  const host = sourceHost(item.source);

  return (
    <Link
      className="itemRow"
      data-type={kind}
      onClick={(event) => {
        if (onOpen) {
          event.preventDefault();
          onOpen();
        }
      }}
      to={item.path}
    >
      <span className="itemRow__thumbCol">
        <span className="itemRow__spine" style={{background: colour}} />
        {item.thumb ? (
          <span className="itemRow__thumb">
            <img alt="" src={item.thumb} />
          </span>
        ) : (
          <span
            className={`itemRow__plate itemRow__plate--${
              isFind ? 'find' : 'note'
            }`}
          >
            <span className="itemRow__plateNote">
              {isFind ? host || 'Link' : 'No image'}
            </span>
          </span>
        )}
        <span className="itemRow__pill" style={{background: colour}}>
          {KIND_LABEL[kind]}
        </span>
      </span>

      {item.category && (
        <span className="itemRow__category">
          <CategoryIcon />
          {isProject ? item.category : slugToTitle(item.category)}
        </span>
      )}

      <span className="itemRow__title">{highlight(item.title)}</span>
      <span className="itemRow__excerpt">{highlight(item.excerpt)}</span>
      <span className="itemRow__date">
        {item.dateDisplay || formatItemDate(item.date)}
      </span>

      {isFind && <span className="itemRow__time">Link ↗</span>}
      {isProject && <span className="itemRow__time">Project ↗</span>}
      {!isFind && !isProject && item.readingTime > 0 && (
        <span className="itemRow__time">
          <ClockIcon size={11} />
          {item.readingTime} min
        </span>
      )}
    </Link>
  );
};

SearchRow.propTypes = {
  highlight: PropTypes.func.isRequired,
  item: PropTypes.shape({
    category: PropTypes.string,
    date: PropTypes.string,
    dateDisplay: PropTypes.string,
    excerpt: PropTypes.string,
    kind: PropTypes.string,
    path: PropTypes.string.isRequired,
    readingTime: PropTypes.number,
    source: PropTypes.string,
    thumb: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    title: PropTypes.string.isRequired,
  }).isRequired,
  onOpen: PropTypes.func,
};

export default SearchRow;
