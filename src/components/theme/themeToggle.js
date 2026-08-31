import React from 'react';
import {useTheme} from './theme';

/*
 * A single button that flips between light and dark. The old three-way
 * light/dark/system cycle is gone from the chrome: the design has one small
 * square here, and "system" survives as the untouched default on first visit.
 */
const ThemeToggle = () => {
  const {resolvedTheme, setThemePreference} = useTheme();
  const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
  const label = `Switch to ${nextTheme} mode`;

  return (
    <button
      aria-label={label}
      className="themeToggle"
      onClick={() => setThemePreference(nextTheme)}
      title={label}
      type="button"
    >
      <span aria-hidden="true">{resolvedTheme === 'dark' ? '☀︎' : '◐'}</span>
    </button>
  );
};

export default ThemeToggle;
