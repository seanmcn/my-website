import React from 'react';
import {useStaticQuery, graphql, Link} from 'gatsby';
import WidgetBox from '../widgetBox';
import './tagWidget.scss';
import {slugToTitle} from '../../../utils/blog';

const tagsWidget = () => {
  const data = useStaticQuery(graphql`query allTagsQuery {
  allMdx {
    group(field: {frontmatter: {tags: SELECT}}) {
      tag: fieldValue
      totalCount
    }
  }
}`);
  const {group: tagsAndCount} = data.allMdx;
  return (
    <WidgetBox
      title="Tags"
      content={(
        <div
          className="tags tagsList"
          aria-label="List of tags used on blog posts"
        >
          {tagsAndCount.filter(tagAndCount => tagAndCount.totalCount > 1).map(
              tagAndCount => (
                <Link
                  to={`/blog/tags/${tagAndCount.tag}`}
                  aria-label={`Links to posts in tag ${slugToTitle(
                      tagAndCount.tag)}`}
                  key={tagAndCount.tag}
                >
                  <div className="tags has-addons">
                    <span className="tag" aria-label="Tag name">
                      {slugToTitle(tagAndCount.tag)}
                    </span>
                    <span
                      className="tag is-primary is-light"
                      aria-label="Count of posts in this tag"
                    >
                      {tagAndCount.totalCount}
                    </span>
                  </div>
                </Link>
              ))}
        </div>
      )}
    />
  );
};

export default tagsWidget;
