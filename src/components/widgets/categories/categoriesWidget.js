import React from 'react';
import {useStaticQuery, graphql, Link} from 'gatsby';
import WidgetBox from '../widgetBox';
import './categoriesWidget.scss';
import {slugToTitle} from '../../../utils/blog';

const CategoriesWidget = () => {
  const data = useStaticQuery(graphql`
    {
      allMdx {
        group(field: frontmatter___category, limit: 1) {
          edges {
            node {
              id
              frontmatter {
                category
              }
            }
          }
          totalCount
        }
      }
    }
  `);
  const {group: categories} = data.allMdx;
  return (
    <WidgetBox
      title="Categories"
      content={(
        <ul className="menu-list categoryList">
          {categories.map(category => (
            <li key={category.edges[0].node.frontmatter.category}>
              <Link
                to={`/blog/categories/`+
                  `${category.edges[0].node.frontmatter.category}`}
              >
                {slugToTitle(category.edges[0].node.frontmatter.category)}
                <span className="badge is/-right">{category.totalCount}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    />
  );
};

export default CategoriesWidget;
