import React from 'react';
import PropTypes from 'prop-types';
import {graphql, Link} from 'gatsby';
import Layout from '../components/layout/layout';
import SEO from '../components/seo/seo';
import RuntimeSeoSync from '../components/seo/runtimeSeoSync';
import {ArrowLeftIcon, TagIcon} from '../components/icons/icons';
import useCondensedHeader from '../hooks/useCondensedHeader';
import useLibraryMeta from '../hooks/useLibraryMeta';
import {slugToTitle, tagPath} from '../utils/content';
import './tags.scss';

/*
 * Every tag at once, ranked by how much has been filed under it, with a bar so
 * the shape of the archive is legible before you read a single label.
 */
const TagsPage = ({data}) => {
  const {title: siteTitle, siteUrl} = data.site.siteMetadata;
  const {tags} = useLibraryMeta();
  const condensed = useCondensedHeader();
  const blurb = 'The tools, platforms and themes that run through the Library.';
  const maxCount = tags.length ? tags[0].count : 1;

  return (
    <Layout>
      <RuntimeSeoSync
        description={blurb}
        pathname="/library/tags/"
        siteUrl={siteUrl}
        title={`Tags - ${siteTitle}`}
      />
      <div className="pageWrap tagsPage">
        <div className={`tagsPage__head ${condensed ? 'is-condensed' : ''}`}>
          <h1 className="tagsPage__title">
            <TagIcon size={19} style={{color: 'var(--accent)'}} />
            Tags
          </h1>
          <p className="tagsPage__blurb">{blurb}</p>
        </div>

        <div className={`stickyBar tagsPage__bar ${
          condensed ? 'is-condensed' : ''
        }`}>
          <Link className="tagsPage__back" to="/library/">
            <ArrowLeftIcon />
            Back to library
          </Link>
          <span className="tagsPage__stickyTitle">{blurb}</span>
          <span className="tagsPage__count">
            <TagIcon size={14} style={{color: 'var(--accent)'}} />
            {tags.length} tags
          </span>
        </div>

        <div className="tagsPage__grid">
          {tags.map(tag => (
            <Link
              className="tagsPage__row"
              key={tag.name}
              to={tagPath(tag.name)}
            >
              <span className="tagsPage__name">{slugToTitle(tag.name)}</span>
              <span className="tagsPage__track">
                <span
                  className={`tagsPage__bar-fill ${
                    tag.count >= 3 ? 'is-strong' : ''
                  }`}
                  style={{
                    width: `${Math.round((tag.count / maxCount) * 100)}%`,
                  }}
                />
              </span>
              <span className="tagsPage__tally">{tag.count}</span>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

TagsPage.propTypes = {
  data: PropTypes.object.isRequired,
};

export default TagsPage;

export const tagsPageQuery = graphql`
  query TagsPageQuery {
    site {
      siteMetadata {
        title
        description
        siteUrl
      }
    }
  }
`;

export const Head = ({data, location}) => {
  const {
    title: siteTitle,
    description: siteDescription,
    siteUrl,
  } = data.site.siteMetadata;
  const title = `Tags - ${siteTitle}`;

  return (
    <>
      <title>{title}</title>
      <SEO
        description={
          'The tools, platforms and themes that run through the library.'
        }
        pathname={location.pathname}
        siteDescription={siteDescription}
        siteTitle={siteTitle}
        siteUrl={siteUrl}
        title={title}
      />
    </>
  );
};
