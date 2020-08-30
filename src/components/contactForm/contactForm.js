import React from 'react'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import ContactFormInputField from './contactFormInputField';
import ContactFormTextAreaField from './contactFormTextAreaField';

const recaptchaKey = '6LfhyvsUAAAAAK0VwkKfGF8YfWeTkD2lCeiLAvJ4'
const getFormUrl = 'https://getform.io/f/d25c4df8-c821-4e9b-8e2f-94e08526caa0'

const ContactForm = () => (
  <GoogleReCaptchaProvider reCaptchaKey={recaptchaKey}>
    <form action={getFormUrl} method="POST">
      <ContactFormInputField displayName="Name" id="name" name="name" placeholder="Your name..." type="text" />
      <ContactFormInputField displayName="Email" id="email" name="email" placeholder="Your email..." type="email" />
      <ContactFormTextAreaField displayName="Message" placeholder="Your message..." id="message" name="message" />
      <div className="control">
        <button className="button is-link" type="submit">
          Send
        </button>
      </div>
    </form>
  </GoogleReCaptchaProvider>
)

export default ContactForm
