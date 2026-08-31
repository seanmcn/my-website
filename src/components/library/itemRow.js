import React from 'react';
import PropTypes from 'prop-types';
import {graphql, Link} from 'gatsby';
import {GatsbyImage, getImage} from 'gatsby-plugin-image';
import {CategoryIcon, ClockIcon} from '../icons/icons';
import {
  formatItemDate,
  itemPath,
  normaliseType,
  readTimeLabel,
  slugToTitle,
  sourceHost,
  typeMeta,
} from '../../utils/content';
import './itemRow.scss';

/*
 * One row in any listing. The thumbnail column always carries a coloured
 * spine in the item's type colour; where there is no image the space is filled
 * with a hatched plate rather than left blank, so a column of notes and finds
 * still reads as a column.
 */
const ItemRow = ({item, highlight}) => {
  const {fields, frontmatter} = item;
  const type = normaliseType(fields?.itemType);
  const meta = typeMeta(type);
  const isFind = type === 'find';
  const image = getImage(frontmatter.featured);
  const category = frontmatter.category;
  const readTime = readTimeLabel(fields?.readingTime);
  const summary = frontmatter.summary || item.excerpt;
  const host = sourceHost(frontmatter.source);

  return (
    <Link
      className="itemRow"
      data-type={type}
      to={itemPath(frontmatter.slug)}
    >
      <span className="itemRow__thumbCol">
        <span
          className="itemRow__spine"
          style={{background: meta.colour}}
        />
        {image ? (
          <span className="itemRow__thumb">
            <GatsbyImage alt="" image={image} />
          </span>
        ) : (
          <span
            className={`itemRow__plate itemRow__plate--${type}`}
          >
            <span className="itemRow__plateNote">
              {isFind ? host || 'Link' : 'No image'}
            </span>
          </span>
        )}
        <span
          className="itemRow__pill"
          style={{background: meta.colour}}
        >
          {meta.label}
        </span>
      </span>

      {isFind ? (
        host && (
          <span className="itemRow__category itemRow__category--source">
            {host}
          </span>
        )
      ) : (
        category && (
          <span className="itemRow__category">
            <CategoryIcon />
            {slugToTitle(category)}
          </span>
        )
      )}

      <span className="itemRow__title">
        {highlight ? highlight(frontmatter.title) : frontmatter.title}
      </span>
      <span className="itemRow__excerpt">
        {highlight ? highlight(summary) : summary}
      </span>
      <span className="itemRow__date">{formatItemDate(frontmatter.date)}</span>

      {isFind ? (
        <span className="itemRow__time">Link ↗</span>
      ) : (
        readTime && (
          <span className="itemRow__time">
            <ClockIcon size={11} />
            {readTime.replace(' read', '')}
          </span>
        )
      )}
    </Link>
  );
};

ItemRow.propTypes = {
  highlight: PropTypes.func,
  item: PropTypes.shape({
    excerpt: PropTypes.string,
    fields: PropTypes.shape({
      itemType: PropTypes.string,
      readingTime: PropTypes.number,
    }),
    frontmatter: PropTypes.shape({
      category: PropTypes.string,
      date: PropTypes.string,
      featured: PropTypes.object,
      slug: PropTypes.string.isRequired,
      source: PropTypes.string,
      summary: PropTypes.string,
      title: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default ItemRow;

export const libraryItemFragment = graphql`
  fragment LibraryItemFields on Mdx {
    id
    excerpt(pruneLength: 190)
    fields {
      itemType
      readingTime
    }
    frontmatter {
      title
      slug
      date
      category
      tags
      summary
      source
      featured {
        childImageSharp {
          gatsbyImageData(
            width: 260
            height: 260
            placeholder: BLURRED
            transformOptions: {cropFocus: NORTH}
          )
        }
      }
    }
  }
`;
