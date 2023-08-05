import React from 'react';
import {useStaticQuery, graphql} from 'gatsby';
import './latestPostsHome.scss';
import PostCard from '../../blog/postCard/postCard';

const LatestPostsHomeWidget = () => {
  const data = useStaticQuery(graphql`query latestPostsHomeQuery {
  allMdx(sort: {frontmatter: {date: DESC}}, limit: 6, skip: 0) {
    edges {
      node {
        ...PostListFields
      }
    }
  }
}`);
  const {edges: posts} = data.allMdx;
  return (<div className={'latestPostsHome'}>
    {posts.map(({node: post}) => {
      const coverImage = post.frontmatter.featured ?
        post.frontmatter.featured :
        null;
      return (<PostCard
        key={post.id}
        id={post.id}
        slug={post.frontmatter.slug}
        title={post.frontmatter.title}
        date={post.frontmatter.date}
        tags={post.frontmatter.tags}
        cover={coverImage}
      />);
    })}
  </div>);
};

export default LatestPostsHomeWidget;
