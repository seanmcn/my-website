import React from 'react'
import { useStaticQuery, graphql, Link } from 'gatsby'
import WidgetBox from '../widgetBox'
import './tagWidget.scss'
import { slugToTitle } from '../../../utils/blog'

const tagsWidget = () => {
  const data = useStaticQuery(graphql`
    query allTagsQuery {
      allMdx {
        distinct(field: frontmatter___tags)
      }
    }
  `)
  const { distinct: tags } = data.allMdx
  return (
    <WidgetBox
      title="Tags"
      content={
        <div
          className="tags tagsList"
          aria-label="List of tags used on blog posts"
        >
          {tags.map((tag) => (
            <Link
              to={`/blog/tags/${tag}`}
              aria-label={`Links to posts in tag ${slugToTitle(tag)}`}
              key={tag}
            >
              <div className="tags has-addons">
                <span className="tag" aria-label="Tag name">
                  {slugToTitle(tag)}
                </span>
                {/* Todo need to create a different schema for tags I guess? */}
                {/* <span */}
                {/*  className="tag is-info" */}
                {/*  aria-label="Count of posts in this tag" */}
                {/* > */}
                {/*  {tag.count} */}
                {/* </span> */}
              </div>
            </Link>
          ))}
        </div>
      }
    />
  )
}

export default tagsWidget
