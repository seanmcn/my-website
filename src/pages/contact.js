import React from 'react'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import { graphql } from 'gatsby';
import Helmet from 'react-helmet';
import Layout from '../components/layout/layout'
import Sidebar from '../components/layout/sidebar'


const recaptchaKey = '6LfhyvsUAAAAAK0VwkKfGF8YfWeTkD2lCeiLAvJ4'
const getFormUrl = 'https://getform.io/f/d25c4df8-c821-4e9b-8e2f-94e08526caa0'

export default class ContactPage extends React.Component {
  render () {
    const { data } = this.props
    const { title: siteTitle } = data.site.siteMetadata

    return (
      <Layout>
        <Helmet>
          <title>{`Contact Me - ${siteTitle}`}</title>
        </Helmet>
        <div className="columns">
          <div className="column is-three-quarters" id="postMainColumn">
            <div className="box">
              <h1 className="title">Contact Me</h1>
              <div>
                <GoogleReCaptchaProvider reCaptchaKey={recaptchaKey}>
                  <form action={getFormUrl} method="POST">
                    <div className="field">
                      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                      <label htmlFor="name" className="label">
                        Name
                      </label>
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          placeholder="Your name..."
                          id="name"
                          name="name"
                        />
                      </div>
                    </div>

                    <div className="field">
                      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                      <label htmlFor="email" className="label">
                        Email
                      </label>
                      <div className="control has-icons-left">
                        <input
                          className="input"
                          type="email"
                          placeholder="Your email..."
                          id="email"
                          name="email"
                        />
                        <span className="icon is-small is-left">
                          <i className="fas fa-envelope" />
                        </span>
                      </div>
                    </div>

                    <div className="field">
                      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                      <label htmlFor="message" className="label">
                        Message
                      </label>
                      <div className="control">
                        <textarea
                          className="textarea"
                          placeholder="Your message...."
                          id="message"
                          name="message"
                        />
                      </div>
                    </div>

                    <div className="control">
                      <button className="button is-link" type="submit">
                        Send
                      </button>
                    </div>
                  </form>
                </GoogleReCaptchaProvider>
              </div>
            </div>
          </div>
          <div className="column is-one-quarter" id="postSidebarColumn">
            <Sidebar />
          </div>
        </div>
      </Layout>

    )
  }
}

export const contactPageQuery = graphql`
    query contactPageQuery {
        site {
            siteMetadata {
                title
            }
        }
    }
`