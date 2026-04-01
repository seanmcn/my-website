/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {PrismAsyncLight as SyntaxHighlighter} from 'react-syntax-highlighter';
import {oneLight} from 'react-syntax-highlighter/dist/esm/styles/prism';
import {icon} from '@fortawesome/fontawesome-svg-core/import.macro';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

// Supported Language Highlighting:
import js from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import php from 'react-syntax-highlighter/dist/esm/languages/prism/php';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import dart from 'react-syntax-highlighter/dist/esm/languages/prism/dart';
import diff from 'react-syntax-highlighter/dist/esm/languages/prism/diff';
import go from 'react-syntax-highlighter/dist/esm/languages/prism/go';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import shellSession
  from 'react-syntax-highlighter/dist/esm/languages/prism/shell-session';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';

const SHELL_LANGUAGE_ALIASES = new Set([
  'bash',
  'console',
  'sh',
  'shell',
  'terminal',
  'zsh',
]);

const resolveLanguage = (language) => {
  if (!language) {
    return undefined;
  }

  const normalizedLanguage = language
      .toLowerCase()
      .replace(/^language-/, '')
      .trim();

  if (SHELL_LANGUAGE_ALIASES.has(normalizedLanguage)) {
    return 'bash';
  }

  if (normalizedLanguage === 'text' || normalizedLanguage === 'plaintext') {
    return 'text';
  }

  return normalizedLanguage;
};

SyntaxHighlighter.registerLanguage('js', js);
SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('php', php);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('sh', bash);
SyntaxHighlighter.registerLanguage('zsh', bash);
SyntaxHighlighter.registerLanguage('console', bash);
SyntaxHighlighter.registerLanguage('terminal', bash);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('dart', dart);
SyntaxHighlighter.registerLanguage('diff', diff);
SyntaxHighlighter.registerLanguage('go', go);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('shell', shellSession);
SyntaxHighlighter.registerLanguage('sql', sql);
SyntaxHighlighter.registerLanguage('yaml', yaml);

export const Code = ({codeString, language}) => {
  const resolvedLanguage = resolveLanguage(language);
  const isPlainText = !resolvedLanguage || resolvedLanguage === 'text';

  // Todo: CopyToClipboard seems to be broken?
  return (
    <div
      className={'codeWrapper'}
      data-language={resolvedLanguage || 'plain'}
    >
      <CopyToClipboard text={codeString}>
        <button className="codeCopyButton button is-small">
          <span className="icon is-small" title={'Copy to clipboard'}>
            <FontAwesomeIcon icon={icon({name: 'copy'})} />
          </span>
        </button>
      </CopyToClipboard>
      {isPlainText ? (
        <pre className="codePlainText">
          <code>{codeString}</code>
        </pre>
      ) : (
        <SyntaxHighlighter
          language={resolvedLanguage}
          style={oneLight}
          wrapLongLines={false}
        >
          {codeString}
        </SyntaxHighlighter>
      )}
    </div>
  );
};

export default Code;
