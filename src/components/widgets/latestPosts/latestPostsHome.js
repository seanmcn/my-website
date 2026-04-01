import React from 'react';
import {useStaticQuery, graphql, Link} from 'gatsby';
import './latestPostsHome.scss';
import PostCard from '../../blog/postCard/postCard';

const LatestPostsHomeWidget = () => {
  const data = useStaticQuery(graphql`query latestPostsHomeQuery {
  allMdx(sort: {frontmatter: {date: DESC}}, limit: 4, skip: 0) {
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
        category={post.frontmatter.category}
        cover={coverImage}
      />);
    })}
    <div className="latestPostsHomeFooter">
      <Link className="latestPostsHomeMoreLink" to="/blog">
        View more posts
      </Link>
    </div>
  </div>);
};

export default LatestPostsHomeWidget;
