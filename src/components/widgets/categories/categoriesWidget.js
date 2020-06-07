import React from 'react'
import { useStaticQuery, graphql, Link } from 'gatsby'
import WidgetBox from '../widgetBox'
import './categoriesWidget.scss'

const CategoriesWidget = () => {
  const data = useStaticQuery(graphql`
    query allCategoriesQuery {
      allWordpressCategory(filter: { count: { gte: 1 } }) {
        edges {
          node {
            id
            slug
            name
            count
          }
        }
      }
    }
  `)
  const { edges: categories } = data.allWordpressCategory
  return (
    <WidgetBox
      title="Categories"
      content={
        <ul className="menu-list categoryList">
          {categories.map(({ node: category }) => (
            <li>
              <Link to={`blog/categories/${category.slug}`}>
                {category.name}
                <span className="badge is-right">{category.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      }
    />
  )
}

export default CategoriesWidget
