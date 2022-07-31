import React from 'react';
import CategoriesWidget from '../widgets/categories/categoriesWidget';
import TagsWidget from '../widgets/tags/tagsWidget';

const Sidebar = () => (
  <div>
    <CategoriesWidget />
    <TagsWidget />
  </div>
);

export default Sidebar;
