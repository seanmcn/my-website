import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'gatsby';
import {CategoryIcon, TagIcon} from '../icons/icons';
import useLibraryMeta from '../../hooks/useLibraryMeta';
import {categoryPath, slugToTitle, tagPath} from '../../utils/content';
import './libraryRail.scss';

const TOP_TAG_COUNT = 6;

/*
 * The left rail on every library screen: what the current view is, then the
 * two ways in — category, or tag. The active facet is pulled out of the list
 * with a tinted row so the rail also acts as a breadcrumb.
 */
const LibraryRail = ({
  activeCategory,
  activeTag,
  blurb,
  count,
  open,
  title,
}) => {
  const {categories, tags} = useLibraryMeta();
  const rankedTags = tags.slice(0, TOP_TAG_COUNT);
  const activeOutsideTop = activeTag &&
    !rankedTags.some(tag => tag.name === activeTag);
  const shownTags = activeOutsideTop ?
    [
      {...tags.find(tag => tag.name === activeTag), outsideTop: true},
      ...rankedTags,
    ].filter(tag => tag.name) :
    rankedTags;
  const maxTagCount = tags.length ? tags[0].count : 1;

  return (
    <aside className={`rail rail--collapsible ${open ? 'is-open' : ''}`}>
      <div className="rail__intro">
        <div className="libraryRail__eyebrow">
          {title} &middot; {count}
        </div>
        <p className="libraryRail__blurb">{blurb}</p>
      </div>

      <div>
        <div className="railHeading">Categories</div>
        {categories.map((category) => {
          const active = activeCategory === category.name;

          return (
            <Link
              className={`facetRow ${active ? 'is-active' : ''}`}
              key={category.name}
              to={active ? '/library/' : categoryPath(category.name)}
            >
              <span className="facetRow__name">
                <CategoryIcon size={14} />
                {slugToTitle(category.name)}
              </span>
              <span className="facetRow__tail">
                {active ? '✕' : category.count}
              </span>
            </Link>
          );
        })}
      </div>

      <div>
        <div className="railHeading libraryRail__tagsHeading">
          Most used tags
        </div>
        {shownTags.map((tag) => {
          const active = activeTag === tag.name;

          return (
            <Link
              className={`tagRow ${active ? 'is-active' : ''} ${
                tag.outsideTop ? 'is-outside' : ''
              }`}
              key={tag.name}
              to={active ? '/library/' : tagPath(tag.name)}
            >
              <span className="tagRow__head">
                <span className="tagRow__name">
                  <TagIcon size={14} />
                  {slugToTitle(tag.name)}
                </span>
                <span className="tagRow__tail">
                  {active ? '✕' : tag.count}
                </span>
              </span>
              <span
                className="tagRow__bar"
                style={{
                  width: `${Math.max(
                      8,
                      Math.round((tag.count / maxTagCount) * 100),
                  )}%`,
                }}
              />
              {tag.outsideTop && (
                <span className="tagRow__note">Outside the top six</span>
              )}
            </Link>
          );
        })}
        <Link className="libraryRail__allTags" to="/library/tags/">
          All {tags.length} tags →
        </Link>
      </div>
    </aside>
  );
};

LibraryRail.propTypes = {
  activeCategory: PropTypes.string,
  activeTag: PropTypes.string,
  blurb: PropTypes.string,
  count: PropTypes.number,
  open: PropTypes.bool,
  title: PropTypes.string,
};

LibraryRail.defaultProps = {
  activeCategory: null,
  activeTag: null,
  blurb: '',
  count: 0,
  open: false,
  title: 'Library',
};

export default LibraryRail;
