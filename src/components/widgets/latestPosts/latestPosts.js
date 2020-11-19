import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import PostListItem from '../../blog/postList/postListItem';
import WidgetBox from '../widgetBox';
import './latestPostsList.scss';

const LatestPostsWidget = () => {
  const data = useStaticQuery(graphql`
    query latestPostsQuery {
      allMdx(
        sort: { fields: frontmatter___date, order: DESC }
        limit: 4
        skip: 0
      ) {
        edges {
          node {
            ...PostListFields
          }
        }
      }
    }
  `);
  const { edges: posts } = data.allMdx;
  return (
    <WidgetBox
      title="Latest Posts"
      content={(
        <ul className="link-list latestPostsList">
          {posts.map(({ node: post }) => (
            <PostListItem
              key={post.id}
              id={post.id}
              slug={post.frontmatter.slug}
              title={post.frontmatter.title}
            />
          ))}
        </ul>
      )}
    />
  );
};

export default LatestPostsWidget;
