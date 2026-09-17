import React from 'react';
import {MDXProvider} from '@mdx-js/react';
import {Code} from './src/components/code/code';
import {ExternalLink} from './src/components/externalLink/externalLink';
import Key from './src/components/icons/keycapKey';
import {Kbd} from './src/components/kbd/kbd';
import {Note} from './src/components/note/note';
import {Step, Steps} from './src/components/steps/steps';
import {
  StickyNote,
  StickyRef,
  StickyStack,
} from './src/components/stickyNote/stickyNote';
import {ThemeProvider} from './src/components/theme/theme';

function preToCodeBlock(preProps) {
  const {children} = preProps;

  if (!React.isValidElement(children)) {
    return null;
  }

  const {children: codeString, className, ...codeProps} = children.props || {};

  if (typeof codeString !== 'string') {
    return null;
  }

  return {
    codeString,
    language: className,
    ...codeProps,
  };
}

// components is its own object outside of render so that the references to
// components are stable
const components = {
  pre: (preProps) => {
    const props = preToCodeBlock(preProps);
    // if there's a codeString and some props, we passed the test
    if (props) {
      // eslint-disable-next-line react/jsx-props-no-spreading
      return <Code {...props} />;
    }
    // it's possible to have a pre without a code in it
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <pre {...preProps} />;
  },
  a: ExternalLink,
  Key,
  Kbd,
  Note,
  Step,
  Steps,
  StickyNote,
  StickyRef,
  StickyStack,
};
export const wrapRootElement = ({element}) => (
  <MDXProvider components={components}>{element}</MDXProvider>
);

// Gatsby also mounts wrapRootElement for Head exports. Keep the stateful theme
// provider around the page only, so a second instance cannot overwrite a manual
// preference when the system appearance changes. This wrapper survives routing.
export const wrapPageElement = ({element}) => (
  <ThemeProvider>{element}</ThemeProvider>
);
