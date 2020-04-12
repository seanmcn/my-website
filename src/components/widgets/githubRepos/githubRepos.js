import React from 'react'
import StaticData from '../../../data/static.json'
import './githubRepos.scss'

const GithubReposWidget = () => (
  <div className="box">
    <h1 className="subtitle">Github Repos</h1>
    <div className="content">
      <ul className="link-list githubRepos">
        {StaticData.github_repos.map((data) => {
          return (
            <li key={data.id}>
              <a
                href={data.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={data.description}
                title={data.description}
                key={data.title}
              >
                {data.title}
              </a>
              {data.icons.map((icon) => {
                return (
                  <i className={`fab ${icon}`} key={icon} />
                )
              })}
              <p className='description'>
                {data.description}
              </p>
            </li>
          )
        })}
      </ul>
    </div>
  </div>
)

export default GithubReposWidget
