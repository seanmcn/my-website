import React from 'react';
import {Code} from './code';

export default {
  title: 'Post components/Code',
  component: Code,
};

export const Bash = {
  render: () => (
    <Code
      codeString={'brew install htop          # command line tools\n' +
        'brew install --cask slack  # actual GUI applications'}
      language="bash"
    />
  ),
};

export const JavaScript = {
  render: () => (
    <Code
      codeString={'const greet = (name) => `Hello, ${name}!`;'}
      language="js"
    />
  ),
};

export const PlainText = {
  render: () => (
    <Code codeString="No syntax highlighting, just a listing." language="" />
  ),
};
