import React from 'react';
import {useStaticQuery, graphql, Link} from 'gatsby';
import WidgetBox from '../widgetBox';
import './categoriesWidget.scss';
import {slugToTitle} from '../../../utils/blog';

const CategoriesWidget = () => {
  const data = useStaticQuery(graphql`{
  allMdx {
    group(field: {frontmatter: {category: SELECT}}, limit: 1) {
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
}`);
  const {group: categories} = data.allMdx;
  return (
    <WidgetBox
      title="Categories"
      content={(
        <ul className="categoryList">
          {categories.map(category => (
            <li key={category.edges[0].node.frontmatter.category}>
              <Link
                to={`/blog/categories/`+
                  `${category.edges[0].node.frontmatter.category}`}
              >
                <span className="categoryName">
                  {slugToTitle(category.edges[0].node.frontmatter.category)}
                </span>
                <span className="categoryCount">{category.totalCount}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    />
  );
};

export default CategoriesWidget;
