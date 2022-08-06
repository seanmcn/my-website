/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {LightAsync as SyntaxHighlighter} from 'react-syntax-highlighter';
import {a11yLight} from 'react-syntax-highlighter/dist/esm/styles/hljs';
// Supported Language Highlighting:
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import php from 'react-syntax-highlighter/dist/esm/languages/hljs/php';
import bash from 'react-syntax-highlighter/dist/esm/languages/hljs/bash';
import css from 'react-syntax-highlighter/dist/esm/languages/hljs/css';
import dart from 'react-syntax-highlighter/dist/esm/languages/hljs/dart';
import diff from 'react-syntax-highlighter/dist/esm/languages/hljs/diff';
import go from 'react-syntax-highlighter/dist/esm/languages/hljs/go';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import shell from 'react-syntax-highlighter/dist/esm/languages/hljs/shell';
import sql from 'react-syntax-highlighter/dist/esm/languages/hljs/sql';
import yaml from 'react-syntax-highlighter/dist/esm/languages/hljs/yaml';
import '../../assets/styles/code.scss';

SyntaxHighlighter.registerLanguage('js', js);
SyntaxHighlighter.registerLanguage('php', php);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('dart', dart);
SyntaxHighlighter.registerLanguage('diff', diff);
SyntaxHighlighter.registerLanguage('go', go);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('shell', shell);
SyntaxHighlighter.registerLanguage('sql', sql);
SyntaxHighlighter.registerLanguage('yaml', yaml);

export const Code = ({codeString, language}) => {
  return (
    <div className={'codeWrapper'}>
      <CopyToClipboard text={codeString}>
        <button className="codeCopyButton button is-small">
          <span className="icon is-small" title={'Copy to clipboard'}>
            <i className="fas fa-copy"></i>
          </span>
        </button>
      </CopyToClipboard>
      <SyntaxHighlighter
        language={language}
        style={a11yLight}
        wrapLongLines={true}
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
};

export default Code;
