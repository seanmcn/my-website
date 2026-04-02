import React from 'react';
import {useStaticQuery, graphql, Link} from 'gatsby';
import PropTypes from 'prop-types';
import WidgetBox from '../widgetBox';
import './tagWidget.scss';
import {slugToTitle} from '../../../utils/blog';

const TagsWidget = ({variant, onLinkClick}) => {
  const data = useStaticQuery(graphql`query allTagsQuery {
  allMdx {
    group(field: {frontmatter: {tags: SELECT}}) {
      tag: fieldValue
      totalCount
    }
  }
}`);
  const {group: tagsAndCount} = data.allMdx;
  const tagsList = (
    <div
      className={`tagsList tagsList--${variant}`}
      aria-label="List of tags used on blog posts"
    >
      {tagsAndCount.filter(tagAndCount => tagAndCount.totalCount > 1).map(
          tagAndCount => (
            <Link
              to={`/blog/tags/${tagAndCount.tag}`}
              aria-label={`Links to posts in tag ${slugToTitle(
                  tagAndCount.tag)}`}
              key={tagAndCount.tag}
              className="tagChipLink"
              onClick={onLinkClick}
            >
              <span className="tagChipLabel" aria-label="Tag name">
                {slugToTitle(tagAndCount.tag)}
              </span>
              <span
                className="tagChipCount"
                aria-label="Count of posts in this tag"
              >
                {tagAndCount.totalCount}
              </span>
            </Link>
          ))}
    </div>
  );

  if (variant === 'drawer') {
    return (
      <section className="drawerWidgetSection" aria-labelledby="drawer-tags">
        <div className="drawerWidgetHeader">
          <h2 id="drawer-tags" className="drawerWidgetTitle">Tags</h2>
        </div>
        <div className="drawerWidgetContent">{tagsList}</div>
      </section>
    );
  }

  return (
    <WidgetBox
      title="Tags"
      content={tagsList}
    />
  );
};

TagsWidget.propTypes = {
  onLinkClick: PropTypes.func,
  variant: PropTypes.oneOf(['sidebar', 'drawer']),
};

TagsWidget.defaultProps = {
  onLinkClick: undefined,
  variant: 'sidebar',
};

export default TagsWidget;
