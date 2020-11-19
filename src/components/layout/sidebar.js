import React from 'react';
import GithubReposWidget from '../widgets/githubRepos/githubRepos';
import LatestPostsWidget from '../widgets/latestPosts/latestPosts';

const Sidebar = () => (
  <div>
    <GithubReposWidget />
    <LatestPostsWidget />
  </div>
);

Sidebar.propTypes = {};

export default Sidebar;
