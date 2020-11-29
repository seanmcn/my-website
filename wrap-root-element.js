import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import { preToCodeBlock } from 'mdx-utils';
import { Code } from './src/components/code/code';

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
// eslint-disable-next-line import/prefer-default-export
export const wrapRootElement = ({ element }) => (
  <MDXProvider components={components}>{element}</MDXProvider>
);
