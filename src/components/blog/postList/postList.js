import React from 'react';
import PropTypes from 'prop-types';
import {graphql} from 'gatsby';
import Post from '../post/post';
import './postList.scss';
import PostCard from '../postCard/postCard';

export default class postList extends React.Component {
  render() {
    const {posts} = this.props;

    return (
      <div className={'is-flex is-flex-direction-row is-flex-wrap-wrap'}>
        {posts.map(({node: post}) => (
          <PostCard
            key={post.id}
            id={post.id}
            content={post.body}
            slug={post.frontmatter.slug}
            title={post.frontmatter.title}
            date={post.frontmatter.date}
            tags={post.frontmatter.tags}
          />
        ))}
      </div>
    );
  }
}

postList.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object),
};

export const pageQuery = graphql`
  fragment PostListFields on Mdx {
    id
    frontmatter {
      title
      date(formatString: "MMMM DD, YYYY")
      slug
      tags
      category
    }
    body
  }
`;
