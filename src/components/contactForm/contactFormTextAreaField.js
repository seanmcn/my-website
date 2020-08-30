import React from 'react'
import PropTypes from 'prop-types'

const ContactFormTextAreaField  = props => {
  const { displayName, placeholder, id, name } = props
  return (
    <div className="field">
      <label htmlFor={name} className="label">
        {displayName}
      </label>
      <div className="control">
        <textarea
          className="textarea"
          placeholder={placeholder}
          id={id}
          name={name}
        />
      </div>
    </div>
  )
}

ContactFormTextAreaField.propTypes = {
  displayName: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
}

export default ContactFormTextAreaField
