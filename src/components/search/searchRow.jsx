import React from 'react';
import PropTypes from 'prop-types';
import {CategoryIcon, ClockIcon} from '../icons/icons.jsx';
import {
  formatItemDate,
  slugToTitle,
  sourceHost,
  TYPE_META,
} from '../../utils/content.js';

const KIND_LABEL = {
  post: 'Post',
  note: 'Note',
  find: 'Find',
  project: 'Project',
};

/*
 * Search results reuse the library row's shape but are built from the flat
 * JSON index rather than collection entries, so they carry no image and lean
 * on the hatched plate instead.
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
    <a
      className="item-row"
      data-type={kind}
      onClick={(event) => {
        if (onOpen) {
          event.preventDefault();
          onOpen();
        }
      }}
      href={item.path}
    >
      <span className="item-row__thumb-col">
        <span className="item-row__spine" style={{background: colour}} />
        {item.thumb ? (
          <span className="item-row__thumb">
            <img alt="" src={item.thumb} />
          </span>
        ) : (
          <span
            className={`item-row__plate item-row__plate--${
              isFind ? 'find' : 'note'
            }`}
          >
            <span className="item-row__plate-note">
              {isFind ? host || 'Link' : 'No image'}
            </span>
          </span>
        )}
        <span className="item-row__pill" style={{background: colour}}>
          {KIND_LABEL[kind]}
        </span>
      </span>

      {item.category && (
        <span className="item-row__category">
          <CategoryIcon size={12} />
          {isProject ? item.category : slugToTitle(item.category)}
        </span>
      )}

      <span className="item-row__title">{highlight(item.title)}</span>
      <span className="item-row__excerpt">{highlight(item.excerpt)}</span>
      <span className="item-row__date">
        {item.dateDisplay || formatItemDate(item.date)}
      </span>

      {isFind && <span className="item-row__time">Link ↗</span>}
      {isProject && <span className="item-row__time">Project ↗</span>}
      {!isFind && !isProject && item.readingTime > 0 && (
        <span className="item-row__time">
          <ClockIcon size={11} />
          {item.readingTime} min
        </span>
      )}
    </a>
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
