import React from 'react';
import {useStaticQuery, graphql, Link} from 'gatsby';
import PropTypes from 'prop-types';
import WidgetBox from '../widgetBox';
import './categoriesWidget.scss';
import {slugToTitle} from '../../../utils/blog';

const CategoriesWidget = ({variant, onLinkClick}) => {
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
  const categoryList = (
    <ul className={`categoryList categoryList--${variant}`}>
      {categories.map(category => (
        <li key={category.edges[0].node.frontmatter.category}>
          <Link
            to={`/blog/categories/`+
              `${category.edges[0].node.frontmatter.category}`}
            onClick={onLinkClick}
          >
            <span className="categoryName">
              {slugToTitle(category.edges[0].node.frontmatter.category)}
            </span>
            <span className="categoryCount">{category.totalCount}</span>
          </Link>
        </li>
      ))}
    </ul>
  );

  if (variant === 'drawer') {
    return (
      <section
        className="drawerWidgetSection"
        aria-labelledby="drawer-categories"
      >
        <div className="drawerWidgetHeader">
          <h2 id="drawer-categories" className="drawerWidgetTitle">
            Categories
          </h2>
        </div>
        <div className="drawerWidgetContent">{categoryList}</div>
      </section>
    );
  }

  return (
    <WidgetBox
      title="Categories"
      content={categoryList}
    />
  );
};

CategoriesWidget.propTypes = {
  onLinkClick: PropTypes.func,
  variant: PropTypes.oneOf(['sidebar', 'drawer']),
};

CategoriesWidget.defaultProps = {
  onLinkClick: undefined,
  variant: 'sidebar',
};

export default CategoriesWidget;
