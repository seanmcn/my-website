import React from 'react';
import {icon} from '@fortawesome/fontawesome-svg-core/import.macro';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

/*
 * The two profiles worth following, shown by both the about and contact pages.
 * It lives out here rather than in either page because Gatsby only allows a
 * page template to export its component, its query, Head, config and
 * getServerData - anything else drops Fast Refresh back to a full reload.
 *
 * Styling sits with the other shared scaffolds in layout.scss.
 */
const ElsewhereLinks = () => (
  <div className="elsewhereLinks">
    <a
      className="elsewhereLink"
      href="https://www.linkedin.com/in/mrseanmcn"
      rel="noopener noreferrer"
      target="_blank"
    >
      <FontAwesomeIcon icon={icon({name: 'linkedin-in', style: 'brands'})} />
      LinkedIn
      <span aria-hidden="true" className="elsewhereLink__arrow">↗</span>
    </a>
    <a
      className="elsewhereLink"
      href="https://github.com/seanmcn"
      rel="noopener noreferrer"
      target="_blank"
    >
      <FontAwesomeIcon icon={icon({name: 'github', style: 'brands'})} />
      GitHub
      <span aria-hidden="true" className="elsewhereLink__arrow">↗</span>
    </a>
  </div>
);

export default ElsewhereLinks;
