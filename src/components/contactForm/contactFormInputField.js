import React from 'react';
import PropTypes from 'prop-types';
import {icon} from '@fortawesome/fontawesome-svg-core/import.macro';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const ContactFormInputField = (props) => {
  const {
    displayName, placeholder, id, name, type,
  } = props;
  return (
    <div className="field">
      <label htmlFor={id} className="label">
        {displayName}
        <div
          className={type === 'email' ? 'control has-icons-left' : 'control'}
        >
          <input
            className="input"
            type={type}
            placeholder={placeholder}
            id={id}
            name={name}
          />
          {type === 'email' && (
            <span className="icon is-small is-left">
              <FontAwesomeIcon icon={icon({name: 'envelope'})} />
            </span>
          )}
        </div>
      </label>
    </div>
  );
};

ContactFormInputField.propTypes = {
  displayName: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default ContactFormInputField;
