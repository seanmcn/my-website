import React from 'react';
import PropTypes from 'prop-types';
import {graphql} from 'gatsby';
import './postList.scss';
import PostCard from '../postCard/postCard';

export default class postList extends React.Component {
  render() {
    const {posts} = this.props;
    console.log(posts);
    return (
      <div className={'is-flex is-flex-direction-row is-flex-wrap-wrap'}>
        {posts.map(({node: post}) => {
          const coverImage = post.frontmatter.featured ?
            post.frontmatter.featured :
            null;

          return (
            <PostCard
              key={post.id}
              id={post.id}
              slug={post.frontmatter.slug}
              title={post.frontmatter.title}
              date={post.frontmatter.date}
              tags={post.frontmatter.tags}
              cover={coverImage}
            />
          );
        })}
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
      featured {
        childImageSharp {
           gatsbyImageData(
            placeholder: BLURRED
            width: 300
            formats: [AUTO, WEBP, AVIF]
          )
        }
      }
    }
    body
  }
`;
