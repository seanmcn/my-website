import React from 'react';
import PropTypes from 'prop-types';
import CategoriesWidget from '../widgets/categories/categoriesWidget';
import TagsWidget from '../widgets/tags/tagsWidget';
import './sidebar.scss';

const Sidebar = ({hideOnMobile}) => (
  <div
    className={`blogSidebar ${
      hideOnMobile ? 'blogSidebar--hide-mobile' : ''
    }`}
  >
    <CategoriesWidget variant="sidebar" />
    <TagsWidget variant="sidebar" />
  </div>
);

Sidebar.propTypes = {
  hideOnMobile: PropTypes.bool,
};

Sidebar.defaultProps = {
  hideOnMobile: false,
};

export default Sidebar;
