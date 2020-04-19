import React from 'react'
import StaticData from '../../../data/static.json'
import './githubRepos.scss'
import WidgetBox from '../widgetBox'
import GithubRepoListItem from './githubRepoListItem'

const GithubReposWidget = () => (
  <WidgetBox
    title="Github Repos"
    content={
      <ul className="link-list githubRepos">
        {StaticData.github_repos.map(data => {
          return (
            <GithubRepoListItem
              key={data.id}
              id={data.id}
              link={data.link}
              description={data.description}
              title={data.title}
              icons={data.icons}
            />
          )
        })}
      </ul>
    }
  />
)

export default GithubReposWidget
