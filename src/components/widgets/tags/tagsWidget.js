import React from 'react'
import { useStaticQuery, graphql, Link } from 'gatsby'
import WidgetBox from '../widgetBox'
import './tagWidget.scss'

const tagsWidget = () => {
  const data = useStaticQuery(graphql`
    query allTagsQuery {
      allWordpressTag(filter: { count: { gte: 2 } }) {
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
  const { edges: tags } = data.allWordpressTag
  return (
    <WidgetBox
      title="Tags"
      content={
        <div
          className="tags tagsList"
          aria-label="List of tags used on blog posts"
        >
          {tags.map(({ node: tag }) => (
            <Link
              to={`blog/tags/${tag.slug}`}
              aria-label={`Links to posts in tag ${tag.name}`}
            >
              <div className="tags has-addons">
                <span className="tag" aria-label="Tag name">
                  {tag.name}
                </span>
                <span
                  className="tag is-info"
                  aria-label="Count of posts in this tag"
                >
                  {tag.count}
                </span>
              </div>
            </Link>
          ))}
        </div>
      }
    />
  )
}

export default tagsWidget
