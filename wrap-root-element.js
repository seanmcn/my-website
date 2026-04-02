import React from 'react';
import {MDXProvider} from '@mdx-js/react';
import {Code} from './src/components/code/code';
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
};
export const wrapRootElement = ({element}) => (
  <ThemeProvider>
    <MDXProvider components={components}>{element}</MDXProvider>
  </ThemeProvider>
);
