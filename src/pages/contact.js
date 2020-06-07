import React from 'react'
import Layout from '../components/layout/layout'
import Sidebar from '../components/layout/sidebar'

const ContactPage = () => (
  <Layout>
    <div className="columns">
      <div className="column is-three-quarters" id="postMainColumn">
        <div className="box">
          <h1 className="title">Contact Me</h1>
          <div>
            <form
              action="https://getform.io/f/d25c4df8-c821-4e9b-8e2f-94e08526caa0"
              method="POST"
            >
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
          </div>
        </div>
      </div>
      <div className="column is-one-quarter" id="postSidebarColumn">
          <Sidebar />
      </div>
    </div>
  </Layout>
)

export default ContactPage
