import React from 'react';
import {
  solid,
} from '@fortawesome/fontawesome-svg-core/import.macro';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useTheme} from './theme';

const THEME_ORDER = ['light', 'dark', 'system'];

const getNextThemePreference = (themePreference) => {
  const currentIndex = THEME_ORDER.indexOf(themePreference);

  if (currentIndex === -1) {
    return 'light';
  }

  return THEME_ORDER[(currentIndex + 1) % THEME_ORDER.length];
};

const getThemeMeta = (themePreference) => {
  if (themePreference === 'dark') {
    return {
      badgeIcon: null,
      iconName: solid('moon'),
      label: 'Dark',
    };
  }

  if (themePreference === 'system') {
    return {
      badgeIcon: solid('desktop'),
      iconName: solid('circle-half-stroke'),
      label: 'System',
    };
  }

  return {
    badgeIcon: null,
    iconName: solid('sun'),
    label: 'Light',
  };
};

const ThemeSelector = () => {
  const {themePreference, setThemePreference} = useTheme();
  const nextThemePreference = getNextThemePreference(themePreference);
  const {badgeIcon, iconName, label} = getThemeMeta(themePreference);

  return (
    <div className="navbar-item siteThemeSelector">
      <button
        type="button"
        className="siteThemeButton"
        aria-label={`Theme: ${label}. Click to switch to ${nextThemePreference}.`}
        title={`Theme: ${label}`}
        data-theme-label={label}
        onClick={() => setThemePreference(nextThemePreference)}
      >
        <span
          className={`siteThemeIcon ${badgeIcon ? 'has-badge' : ''}`}
          aria-hidden="true"
        >
          <FontAwesomeIcon icon={iconName} />
          {badgeIcon ? (
            <span className="siteThemeIconBadge">
              <FontAwesomeIcon icon={badgeIcon} />
            </span>
          ) : null}
        </span>
      </button>
    </div>
  );
};

export default ThemeSelector;
