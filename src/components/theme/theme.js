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
  // Initialise with SSR-safe defaults so the first client render matches the
  // server-rendered HTML (avoids React #418/#423 hydration mismatches). The
  // real values from localStorage / <html> dataset are picked up below, in
  // the same effect that applies/persists theme state, so that pass never
  // runs the "apply/persist" effect with these stale defaults - see the
  // isHydrating ref below.
  const [themePreference, setThemePreferenceState] = React.useState('system');
  const [hasStoredPreference, setHasStoredPreference] = React.useState(false);
  const [systemTheme, setSystemTheme] = React.useState('light');

  const resolvedTheme = themePreference === 'system' ? systemTheme :
    themePreference;

  // Guards the very first run of the effect below, which otherwise sees the
  // SSR-safe defaults above rather than the real localStorage/dataset
  // values. A prior version split "sync real values into state" and
  // "apply + persist" into two separate effects; both ran, in order, within
  // the *same* initial commit, so the persist effect's first run still saw
  // the stale defaults (state updates from the sync effect aren't visible
  // until the next render) and wrote 'system'/unset - wiping any real
  // stored preference - a moment before a second, corrected run put it
  // back. That gap is enough to lose the preference for real if anything
  // interrupts it (slow devices, a tab closed mid-load). Merging both into
  // one effect lets the first run resync state and bail out *before*
  // persisting, so the destructive write never happens.
  const isHydrating = React.useRef(true);

  React.useEffect(() => {
    if (isHydrating.current) {
      const initialPreference = getInitialThemePreference();
      const initialHasStoredPreference = getInitialHasStoredPreference();
      const initialSystemTheme = getSystemTheme();
      const needsResync = initialPreference !== themePreference ||
        initialHasStoredPreference !== hasStoredPreference ||
        initialSystemTheme !== systemTheme;

      if (needsResync) {
        if (initialPreference !== themePreference) {
          setThemePreferenceState(initialPreference);
        }
        if (initialHasStoredPreference !== hasStoredPreference) {
          setHasStoredPreference(initialHasStoredPreference);
        }
        if (initialSystemTheme !== systemTheme) {
          setSystemTheme(initialSystemTheme);
        }

        // Keep the DOM in sync immediately (idempotent - the boot script
        // already applied this), but don't persist yet: this effect runs
        // again once the corrected state above commits, and persists then.
        const initialResolvedTheme = initialPreference === 'system' ?
          initialSystemTheme : initialPreference;
        applyThemeToDocument(initialPreference, initialResolvedTheme);

        return;
      }
    }

    isHydrating.current = false;
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
