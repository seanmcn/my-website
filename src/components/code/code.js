/* eslint-disable react/jsx-props-no-spreading */
import React, {useEffect, useRef, useState} from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {PrismAsyncLight as SyntaxHighlighter} from 'react-syntax-highlighter';
import {oneLight} from 'react-syntax-highlighter/dist/esm/styles/prism';
import {oneDark} from 'react-syntax-highlighter/dist/esm/styles/prism';
import {icon} from '@fortawesome/fontawesome-svg-core/import.macro';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useTheme} from '../theme/theme';

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

const buildMermaidTheme = resolvedTheme => ({
  startOnLoad: false,
  securityLevel: 'strict',
  theme: 'base',
  themeVariables: resolvedTheme === 'dark' ? {
    primaryColor: '#14212b',
    primaryBorderColor: '#74d3c3',
    primaryTextColor: '#eaf2f6',
    secondaryColor: '#1a2b38',
    secondaryBorderColor: '#74d3c3',
    secondaryTextColor: '#eaf2f6',
    tertiaryColor: '#0d151d',
    tertiaryBorderColor: '#aac0cb',
    tertiaryTextColor: '#d5dee4',
    mainBkg: '#0d151d',
    nodeBkg: '#14212b',
    nodeBorder: '#74d3c3',
    clusterBkg: '#1a2b38',
    clusterBorder: '#74d3c3',
    lineColor: '#d5dee4',
    defaultLinkColor: '#d5dee4',
    textColor: '#eaf2f6',
    fontFamily: 'Raleway, Century Gothic, CenturyGothic, ' +
      'AppleGothic, sans-serif',
  } : {
    primaryColor: '#e6e6ea',
    primaryBorderColor: '#227c71',
    primaryTextColor: '#264653',
    secondaryColor: '#ffffff',
    secondaryBorderColor: '#227c71',
    secondaryTextColor: '#264653',
    tertiaryColor: '#f4f4f8',
    tertiaryBorderColor: '#264653',
    tertiaryTextColor: '#264653',
    mainBkg: '#f4f4f8',
    nodeBkg: '#f4f4f8',
    nodeBorder: '#227c71',
    clusterBkg: '#ffffff',
    clusterBorder: '#227c71',
    lineColor: '#264653',
    defaultLinkColor: '#264653',
    textColor: '#264653',
    fontFamily: 'Raleway, Century Gothic, CenturyGothic, ' +
      'AppleGothic, sans-serif',
  },
});

let mermaidModulePromise;
let mermaidIdCounter = 0;

const getMermaid = async (resolvedTheme) => {
  if (!mermaidModulePromise) {
    mermaidModulePromise = import('mermaid').then(module => module.default);
  }

  const mermaid = await mermaidModulePromise;
  mermaid.initialize(buildMermaidTheme(resolvedTheme));

  return mermaid;
};

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

const MermaidDiagram = ({codeString, resolvedTheme}) => {
  const [svg, setSvg] = useState('');
  const [hasError, setHasError] = useState(false);
  const diagramIdRef = useRef(null);

  if (!diagramIdRef.current) {
    mermaidIdCounter += 1;
    diagramIdRef.current = `mermaid-diagram-${mermaidIdCounter}`;
  }

  useEffect(() => {
    let isMounted = true;

    const renderDiagram = async () => {
      try {
        const mermaid = await getMermaid(resolvedTheme);
        const {svg: renderedSvg} = await mermaid.render(
            diagramIdRef.current,
            codeString.trim(),
        );

        if (!isMounted) {
          return;
        }

        setSvg(renderedSvg);
        setHasError(false);
      } catch (error) {
        console.error('Failed to render Mermaid diagram', error);

        if (!isMounted) {
          return;
        }

        setSvg('');
        setHasError(true);
      }
    };

    renderDiagram();

    return () => {
      isMounted = false;
    };
  }, [codeString, resolvedTheme]);

  const renderState = hasError ? 'error' : svg ? 'rendered' : 'pending';

  return (
    <div
      className="codeWrapper mermaidWrapper"
      data-language="mermaid"
      data-mermaid-state={renderState}
    >
      {svg ? (
        <div
          className="mermaidRendered"
          dangerouslySetInnerHTML={{__html: svg}}
        />
      ) : null}
      <pre className="mermaidFallback" aria-hidden={Boolean(svg)}>
        <code>{codeString}</code>
      </pre>
    </div>
  );
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
  const {resolvedTheme} = useTheme();
  const resolvedLanguage = resolveLanguage(language);
  const isMermaid = resolvedLanguage === 'mermaid';
  const isPlainText = !resolvedLanguage || resolvedLanguage === 'text';

  if (isMermaid) {
    return (
      <MermaidDiagram
        codeString={codeString}
        resolvedTheme={resolvedTheme}
      />
    );
  }

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
          style={resolvedTheme === 'dark' ? oneDark : oneLight}
          wrapLongLines={false}
        >
          {codeString}
        </SyntaxHighlighter>
      )}
    </div>
  );
};

export default Code;
