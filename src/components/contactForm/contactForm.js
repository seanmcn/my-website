import React from 'react';
import PropTypes from 'prop-types';
import {GoogleReCaptchaProvider} from 'react-google-recaptcha-v3';
import './contactForm.scss';

const recaptchaKey = '6LfhyvsUAAAAAK0VwkKfGF8YfWeTkD2lCeiLAvJ4';
const getFormUrl = 'https://getform.io/f/d25c4df8-c821-4e9b-8e2f-94e08526caa0';

const ContactForm = ({aboutSlug, aboutTitle, email}) => (
  <GoogleReCaptchaProvider reCaptchaKey={recaptchaKey}>
    <form action={getFormUrl} className="contactForm" method="POST">
      {/* Carries the article reference through to the submitted message. */}
      {aboutSlug && (
        <input
          name="about"
          type="hidden"
          value={`${aboutTitle} — /library/${aboutSlug}/`}
        />
      )}

      <div className="contactForm__grid">
        <div className="contactForm__field">
          <label className="contactForm__label" htmlFor="name">Name</label>
          <input
            className="contactForm__input"
            id="name"
            name="name"
            placeholder="Your name"
            required
            type="text"
          />
        </div>
        <div className="contactForm__field">
          <label className="contactForm__label" htmlFor="email">Email</label>
          <input
            className="contactForm__input"
            id="email"
            name="email"
            placeholder="you@example.com"
            required
            type="email"
          />
        </div>
      </div>

      <label
        className="contactForm__label contactForm__label--block"
        htmlFor="message"
      >
        Message
      </label>
      <textarea
        className="contactForm__input contactForm__textarea"
        id="message"
        name="message"
        placeholder="Your message"
        required
        rows={6}
      />

      <div className="contactForm__actions">
        <button className="contactForm__submit" type="submit">
          Send message
        </button>
        <span className="contactForm__hint">
          Or email <a href={`mailto:${email}`}>{email}</a> directly.
        </span>
      </div>
    </form>
  </GoogleReCaptchaProvider>
);

ContactForm.propTypes = {
  aboutSlug: PropTypes.string,
  aboutTitle: PropTypes.string,
  email: PropTypes.string,
};

ContactForm.defaultProps = {
  aboutSlug: null,
  aboutTitle: null,
  email: 'me@seanmcn.com',
};

export default ContactForm;
