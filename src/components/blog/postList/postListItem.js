import React from 'react';
import { Link } from 'gatsby';
import '../post/post.scss';
import PropTypes from 'prop-types';

const PostListItem = ({ id, slug, title }) => (
  <li key={id} className="list-item">
    <Link
      className="has-text-primary"
      to={`/blog/${slug}/`}
      dangerouslySetInnerHTML={{ __html: title }}
    />
  </li>
);

PostListItem.propTypes = {
  id: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default PostListItem;
