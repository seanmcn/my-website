import React from 'react';
import {useEffect, useGlobals} from 'storybook/preview-api';
import '../src/assets/styles/main.scss';
import '../src/assets/styles/content.scss';
import '../src/assets/styles/code.scss';
import {THEME_STORAGE_KEY, ThemeProvider} from '../src/components/theme/theme';

function syncThemeStorage(theme) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    // Storybook running somewhere localStorage is unavailable - the story
    // just falls back to system preference, same as the real site would.
  }
}

// ThemeProvider reads its initial preference from localStorage on mount and
// persists whatever it resolves to right back there, so it renders
// correctly on first load and when switching stories. But its React state
// only reacts to *its own* mount effect, and a plain React effect (or even
// reading context.globals.theme directly, as a bare decorator argument)
// doesn't reliably get re-invoked here by a same-story toolbar toggle.
// @storybook/addon-themes hits the identical problem and solves it by
// skipping React state for the toggle entirely: stamp the DOM directly, via
// storybook/preview-api's own useEffect rather than React's, inside a
// useGlobals-driven decorator. Copying that pattern here, since ThemeProvider
// already reads/writes the exact same data-theme attribute and localStorage
// key that this then forces to match.
const withThemeAndProse = (Story) => {
  const [{theme}] = useGlobals();
  const resolvedTheme = theme || 'light';

  syncThemeStorage(resolvedTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  return (
    <ThemeProvider>
      <div className="prose" style={{maxWidth: 760, padding: '40px 32px'}}>
        <Story />
      </div>
    </ThemeProvider>
  );
};

/** @type {import('@storybook/react').Preview} */
const preview = {
  decorators: [withThemeAndProse],
  globalTypes: {
    theme: {
      description: 'Site theme',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          {value: 'light', icon: 'sun', title: 'Light'},
          {value: 'dark', icon: 'moon', title: 'Dark'},
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    // The real background comes from --bg via the theme toggle above, not
    // Storybook's own backgrounds addon.
    backgrounds: {disable: true},
  },
};

export default preview;
