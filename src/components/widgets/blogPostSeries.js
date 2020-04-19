import React from 'react'
import WidgetBox from './widgetBox'

const BlogPostSeriesWidget = () => (
  <WidgetBox
    title="Blog Post Series"
    content={
      <div>
        <ul className="link-list">
          <li className="list-item">
            <a href="">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </a>
          </li>
          <li className="list-item">
            <a href="">Praesent ac sapien vel orci tincidunt ornare.</a>
          </li>
          <li className="list-item">
            <a href="">
              Nam vel massa eu dui fringilla elementum et eget turpis.
            </a>
          </li>
        </ul>
        <button className="button is-link is-small is-fullwidth">
          View more
        </button>
      </div>
    }
  />
)

export default BlogPostSeriesWidget
