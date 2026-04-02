import React from 'react';

export const THEME_STORAGE_KEY = 'site-theme-preference';

const THEME_MEDIA_QUERY = '(prefers-color-scheme: dark)';
const VALID_THEME_PREFERENCES = new Set(['light', 'dark', 'system']);

const ThemeContext = React.createContext(null);

const canUseBrowserApis = () => typeof window !== 'undefined' &&
  typeof document !== 'undefined';

const getSystemTheme = () => {
  if (!canUseBrowserApis() || typeof window.matchMedia !== 'function') {
    return 'light';
  }

  return window.matchMedia(THEME_MEDIA_QUERY).matches ? 'dark' : 'light';
};

const getStoredThemePreference = () => {
  if (!canUseBrowserApis()) {
    return null;
  }

  try {
    const storedPreference = window.localStorage.getItem(THEME_STORAGE_KEY);

    if (VALID_THEME_PREFERENCES.has(storedPreference)) {
      return storedPreference;
    }
  } catch (error) {
    console.warn('Unable to read theme preference from localStorage', error);
  }

  return null;
};

const getInitialThemePreference = () => {
  if (!canUseBrowserApis()) {
    return 'system';
  }

  const {dataset} = document.documentElement;

  if (VALID_THEME_PREFERENCES.has(dataset.themePreference)) {
    return dataset.themePreference;
  }

  return getStoredThemePreference() || 'system';
};

const getInitialHasStoredPreference = () => {
  if (!canUseBrowserApis()) {
    return false;
  }

  return document.documentElement.dataset.themePersisted === 'true' ||
    Boolean(getStoredThemePreference());
};

const applyThemeToDocument = (themePreference, resolvedTheme) => {
  if (!canUseBrowserApis()) {
    return;
  }

  const root = document.documentElement;
  root.dataset.theme = resolvedTheme;
  root.dataset.themePreference = themePreference;
  root.style.colorScheme = resolvedTheme;
};

const persistThemePreference = (themePreference, hasStoredPreference) => {
  if (!canUseBrowserApis()) {
    return;
  }

  try {
    if (hasStoredPreference) {
      window.localStorage.setItem(THEME_STORAGE_KEY, themePreference);
    } else {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
    }
  } catch (error) {
    console.warn('Unable to write theme preference to localStorage', error);
  }
};

export const ThemeProvider = ({children}) => {
  const [themePreference, setThemePreferenceState] = React.useState(
      getInitialThemePreference,
  );
  const [hasStoredPreference, setHasStoredPreference] = React.useState(
      getInitialHasStoredPreference,
  );
  const [systemTheme, setSystemTheme] = React.useState(getSystemTheme);

  const resolvedTheme = themePreference === 'system' ? systemTheme :
    themePreference;

  React.useEffect(() => {
    applyThemeToDocument(themePreference, resolvedTheme);
    persistThemePreference(themePreference, hasStoredPreference);
    document.documentElement.dataset.themePersisted = hasStoredPreference ?
      'true' : 'false';
  }, [hasStoredPreference, resolvedTheme, themePreference]);

  React.useEffect(() => {
    if (!canUseBrowserApis() || typeof window.matchMedia !== 'function') {
      return undefined;
    }

    const mediaQueryList = window.matchMedia(THEME_MEDIA_QUERY);
    const handleChange = (event) => {
      setSystemTheme(event.matches ? 'dark' : 'light');
    };

    setSystemTheme(mediaQueryList.matches ? 'dark' : 'light');

    if (typeof mediaQueryList.addEventListener === 'function') {
      mediaQueryList.addEventListener('change', handleChange);

      return () => mediaQueryList.removeEventListener('change', handleChange);
    }

    mediaQueryList.addListener(handleChange);

    return () => mediaQueryList.removeListener(handleChange);
  }, []);

  const setThemePreference = React.useCallback((nextThemePreference) => {
    if (!VALID_THEME_PREFERENCES.has(nextThemePreference)) {
      return;
    }

    setThemePreferenceState(nextThemePreference);
    setHasStoredPreference(true);
  }, []);

  const contextValue = React.useMemo(() => ({
    resolvedTheme,
    setThemePreference,
    themePreference,
  }), [resolvedTheme, setThemePreference, themePreference]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const themeContext = React.useContext(ThemeContext);

  if (!themeContext) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return themeContext;
};
