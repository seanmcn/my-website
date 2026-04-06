/* eslint-disable react/jsx-props-no-spreading */
import React, {useEffect, useRef, useState} from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {PrismAsyncLight as SyntaxHighlighter} from 'react-syntax-highlighter';
import {oneLight} from 'react-syntax-highlighter/dist/esm/styles/prism';
import {oneDark} from 'react-syntax-highlighter/dist/esm/styles/prism';
import {icon} from '@fortawesome/fontawesome-svg-core/import.macro';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Modal from 'react-modal';
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
const MERMAID_VIEWER_MIN_ZOOM = 0.5;
const MERMAID_VIEWER_MAX_ZOOM = 6;
const MERMAID_VIEWER_ZOOM_STEP = 0.25;
const MERMAID_VIEWER_FIT_MARGIN = 0.96;

if (typeof document !== 'undefined') {
  Modal.setAppElement('#___gatsby');
}

const getMermaid = async (resolvedTheme) => {
  if (!mermaidModulePromise) {
    mermaidModulePromise = import('mermaid').then(module => module.default);
  }

  const mermaid = await mermaidModulePromise;
  mermaid.initialize(buildMermaidTheme(resolvedTheme));

  return mermaid;
};

const renderMermaidSvg = async (codeString, resolvedTheme, diagramId) => {
  const mermaid = await getMermaid(resolvedTheme);

  return mermaid.render(
      diagramId,
      codeString.trim(),
  );
};

const parseMermaidSvgDimensions = (svgMarkup) => {
  if (!svgMarkup) {
    return {width: 1, height: 1};
  }

  const viewBoxMatch = svgMarkup.match(
      /viewBox="[-\d.]+\s+[-\d.]+\s+([\d.]+)\s+([\d.]+)"/i,
  );

  if (viewBoxMatch) {
    return {
      width: Math.max(Number(viewBoxMatch[1]) || 1, 1),
      height: Math.max(Number(viewBoxMatch[2]) || 1, 1),
    };
  }

  const widthMatch = svgMarkup.match(/width="([\d.]+)(?:px)?"/i);
  const heightMatch = svgMarkup.match(/height="([\d.]+)(?:px)?"/i);

  return {
    width: Math.max(Number(widthMatch?.[1]) || 1, 1),
    height: Math.max(Number(heightMatch?.[1]) || 1, 1),
  };
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
  const [inlineSvg, setInlineSvg] = useState('');
  const [modalSvg, setModalSvg] = useState('');
  const [hasError, setHasError] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isViewerPanning, setIsViewerPanning] = useState(false);
  const [isViewerRotated, setIsViewerRotated] = useState(false);
  const [modalSvgBounds, setModalSvgBounds] = useState(null);
  const [viewerZoom, setViewerZoom] = useState(1);
  const [viewerCanvasSize, setViewerCanvasSize] = useState({
    width: 0,
    height: 0,
  });
  const inlineDiagramIdRef = useRef(null);
  const modalDiagramIdRef = useRef(null);
  const modalRenderedRef = useRef(null);
  const panStateRef = useRef(null);
  const viewerCanvasRef = useRef(null);
  const orientationLockRef = useRef(false);

  if (!inlineDiagramIdRef.current || !modalDiagramIdRef.current) {
    mermaidIdCounter += 1;
    inlineDiagramIdRef.current = `mermaid-diagram-${mermaidIdCounter}`;
    modalDiagramIdRef.current = `mermaid-diagram-modal-${mermaidIdCounter}`;
  }

  useEffect(() => {
    let isMounted = true;

    const renderDiagram = async () => {
      try {
        const [
          {svg: renderedInlineSvg},
          {svg: renderedModalSvg},
        ] = await Promise.all([
          renderMermaidSvg(
              codeString,
              resolvedTheme,
              inlineDiagramIdRef.current,
          ),
          renderMermaidSvg(
              codeString,
              resolvedTheme,
              modalDiagramIdRef.current,
          ),
        ]);

        if (!isMounted) {
          return;
        }

        setInlineSvg(renderedInlineSvg);
        setModalSvg(renderedModalSvg);
        setModalSvgBounds(null);
        setHasError(false);
      } catch (error) {
        console.error('Failed to render Mermaid diagram', error);

        if (!isMounted) {
          return;
        }

        setInlineSvg('');
        setModalSvg('');
        setModalSvgBounds(null);
        setHasError(true);
      }
    };

    renderDiagram();

    return () => {
      isMounted = false;
    };
  }, [codeString, resolvedTheme]);

  useEffect(() => {
    if (!isViewerOpen) {
      return undefined;
    }

    let isMounted = true;

    const lockOrientation = async () => {
      const orientationApi = screen.orientation;

      if (!orientationApi?.lock) {
        return;
      }

      try {
        await orientationApi.lock('landscape');

        if (!isMounted) {
          await orientationApi.unlock?.();
          return;
        }

        orientationLockRef.current = true;
      } catch (error) {
        orientationLockRef.current = false;
      }
    };

    lockOrientation();

    return () => {
      isMounted = false;

      if (orientationLockRef.current) {
        screen.orientation?.unlock?.();
        orientationLockRef.current = false;
      }
    };
  }, [isViewerOpen]);

  useEffect(() => {
    if (!isViewerOpen) {
      return undefined;
    }

    let resizeObserver;
    let animationFrameId = 0;

    const updateCanvasSize = () => {
      const canvasElement = viewerCanvasRef.current;

      if (!canvasElement) {
        animationFrameId = window.requestAnimationFrame(updateCanvasSize);
        return;
      }

      const computedStyle = window.getComputedStyle(canvasElement);
      const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
      const paddingRight = parseFloat(computedStyle.paddingRight) || 0;
      const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
      const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;
      const width =
        canvasElement.clientWidth - paddingLeft - paddingRight;
      const height =
        canvasElement.clientHeight - paddingTop - paddingBottom;

      if (width <= 0 || height <= 0) {
        animationFrameId = window.requestAnimationFrame(updateCanvasSize);
        return;
      }

      setViewerCanvasSize({
        width: Math.max(width || 0, 1),
        height: Math.max(height || 0, 1),
      });

      if (!resizeObserver) {
        resizeObserver = new ResizeObserver(() => {
          updateCanvasSize();
        });

        resizeObserver.observe(canvasElement);
      }
    };

    updateCanvasSize();

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }

      resizeObserver?.disconnect();
    };
  }, [isViewerOpen]);

  useEffect(() => {
    if (!isViewerOpen || !modalSvg || !modalRenderedRef.current) {
      return undefined;
    }

    const measureSvgBounds = () => {
      const modalSvgElement = modalRenderedRef.current?.querySelector('svg');

      if (!modalSvgElement) {
        return;
      }

      const measuredBounds = modalSvgElement.getBBox();
      const parsedSvgSize = parseMermaidSvgDimensions(modalSvg);

      setModalSvgBounds({
        height: Math.max(measuredBounds.height || parsedSvgSize.height, 1),
        naturalHeight: parsedSvgSize.height,
        naturalWidth: parsedSvgSize.width,
        width: Math.max(measuredBounds.width || parsedSvgSize.width, 1),
        x: measuredBounds.x || 0,
        y: measuredBounds.y || 0,
      });
    };

    const animationFrameId = window.requestAnimationFrame(measureSvgBounds);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [isViewerOpen, modalSvg]);

  useEffect(() => {
    if (!isViewerOpen || !viewerCanvasRef.current || viewerZoom !== 1) {
      return undefined;
    }

    const canvasElement = viewerCanvasRef.current;
    const animationFrameId = window.requestAnimationFrame(() => {
      canvasElement.scrollTo({left: 0, top: 0});
    });

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [
    isViewerOpen,
    isViewerRotated,
    viewerZoom,
    viewerCanvasSize,
    modalSvgBounds,
  ]);

  const openViewer = () => {
    setIsViewerRotated(false);
    setViewerZoom(1);
    setIsViewerOpen(true);
  };

  const closeViewer = () => {
    setIsViewerOpen(false);
    setIsViewerPanning(false);
    setIsViewerRotated(false);
    setViewerZoom(1);
  };

  const toggleViewerRotation = () => {
    stopViewerPanning();
    setIsViewerRotated(currentValue => !currentValue);
  };

  const decreaseViewerZoom = () => {
    setViewerZoom(currentValue => Math.max(
        MERMAID_VIEWER_MIN_ZOOM,
        currentValue - MERMAID_VIEWER_ZOOM_STEP,
    ));
  };

  const increaseViewerZoom = () => {
    setViewerZoom(currentValue => Math.min(
        MERMAID_VIEWER_MAX_ZOOM,
        currentValue + MERMAID_VIEWER_ZOOM_STEP,
    ));
  };

  const resetViewerZoom = () => {
    stopViewerPanning();
    setViewerZoom(1);
  };

  const stopViewerPanning = () => {
    panStateRef.current = null;
    setIsViewerPanning(false);
  };

  const startViewerPanning = (event) => {
    if (viewerZoom <= 1 || event.pointerType === 'touch' ||
      !viewerCanvasRef.current) {
      return;
    }

    panStateRef.current = {
      pointerId: event.pointerId,
      startScrollLeft: viewerCanvasRef.current.scrollLeft,
      startScrollTop: viewerCanvasRef.current.scrollTop,
      startX: event.clientX,
      startY: event.clientY,
    };

    viewerCanvasRef.current.setPointerCapture(event.pointerId);
    setIsViewerPanning(true);
  };

  const panViewer = (event) => {
    if (!panStateRef.current || !viewerCanvasRef.current ||
      panStateRef.current.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - panStateRef.current.startX;
    const deltaY = event.clientY - panStateRef.current.startY;

    viewerCanvasRef.current.scrollLeft =
      panStateRef.current.startScrollLeft - deltaX;
    viewerCanvasRef.current.scrollTop =
      panStateRef.current.startScrollTop - deltaY;
  };

  const renderState = hasError ? 'error' : inlineSvg ? 'rendered' : 'pending';
  const viewerClassName = [
    'mermaidViewerModal',
    isViewerRotated ? 'is-rotated' : '',
  ].filter(Boolean).join(' ');
  const viewerControlButtonClassName = [
    'mermaidActionButton',
    'mermaidViewerControlButton',
    'button',
  ].join(' ');
  const viewerZoomPercent = Math.round(viewerZoom * 100);
  const modalSvgSize = modalSvgBounds || {
    ...parseMermaidSvgDimensions(modalSvg),
    naturalHeight: parseMermaidSvgDimensions(modalSvg).height,
    naturalWidth: parseMermaidSvgDimensions(modalSvg).width,
    x: 0,
    y: 0,
  };
  const fitWidth = isViewerRotated ? modalSvgSize.height : modalSvgSize.width;
  const fitHeight = isViewerRotated ? modalSvgSize.width : modalSvgSize.height;
  const baseScale = Math.min(
      viewerCanvasSize.width / fitWidth || 1,
      viewerCanvasSize.height / fitHeight || 1,
  ) * MERMAID_VIEWER_FIT_MARGIN;
  const totalScale = baseScale * viewerZoom;
  const contentWidth = Math.max(
      Math.round(modalSvgSize.width * totalScale),
      1,
  );
  const contentHeight = Math.max(
      Math.round(modalSvgSize.height * totalScale),
      1,
  );
  const stageWidth = isViewerRotated ? contentHeight : contentWidth;
  const stageHeight = isViewerRotated ? contentWidth : contentHeight;
  const viewerHasHorizontalOverflow = stageWidth > viewerCanvasSize.width;
  const viewerHasVerticalOverflow = stageHeight > viewerCanvasSize.height;
  const viewerHasOverflow = viewerHasHorizontalOverflow ||
    viewerHasVerticalOverflow;
  const viewerIsPannable = viewerZoom > 1 || viewerHasOverflow;
  const positionerWidth = Math.max(stageWidth, viewerCanvasSize.width);
  const positionerHeight = Math.max(stageHeight, viewerCanvasSize.height);
  const stageOffsetLeft = viewerHasHorizontalOverflow ? 0 :
    Math.max(Math.round((positionerWidth - stageWidth) / 2), 0);
  const stageOffsetTop = viewerHasVerticalOverflow ? 0 :
    Math.max(Math.round((positionerHeight - stageHeight) / 2), 0);
  const renderedTransform = `translate(${Math.round(
      -modalSvgSize.x * totalScale,
  )}px, ${Math.round(-modalSvgSize.y * totalScale)}px)`;
  const rotationTransform = isViewerRotated ?
    `translate(0, ${contentWidth}px) rotate(-90deg)` :
    'none';

  return (
    <>
      <div
        className="codeWrapper mermaidWrapper"
        data-language="mermaid"
        data-mermaid-state={renderState}
      >
        {inlineSvg ? (
          <>
            <button
              type="button"
              className={
                'mermaidActionButton mermaidExpandButton button is-small'
              }
              onClick={openViewer}
              aria-label="Open Mermaid diagram in fullscreen viewer"
            >
              <span className="icon is-small" aria-hidden="true">
                <FontAwesomeIcon icon={icon({name: 'expand'})} />
              </span>
              <span>Fullscreen</span>
            </button>
            <div
              className="mermaidRendered"
              dangerouslySetInnerHTML={{__html: inlineSvg}}
            />
          </>
        ) : null}
        <pre className="mermaidFallback" aria-hidden={Boolean(inlineSvg)}>
          <code>{codeString}</code>
        </pre>
      </div>
      <Modal
        isOpen={isViewerOpen && Boolean(modalSvg)}
        onRequestClose={closeViewer}
        className={viewerClassName}
        overlayClassName="mermaidViewerOverlay"
        contentLabel="Fullscreen Mermaid diagram"
      >
        <div className="mermaidViewerHeader">
          <div>
            <h2 className="mermaidViewerTitle">Diagram viewer</h2>
            <p className="mermaidViewerSubtitle">
              Rotate for a wider layout on narrow screens.
            </p>
          </div>
          <div className="mermaidViewerActions">
            <div
              className="mermaidZoomControls"
              role="group"
              aria-label="Diagram zoom controls"
            >
              <button
                type="button"
                className={viewerControlButtonClassName}
                onClick={decreaseViewerZoom}
                aria-label="Zoom out Mermaid diagram"
                title="Zoom out"
                disabled={viewerZoom <= MERMAID_VIEWER_MIN_ZOOM}
              >
                <span className="icon is-small" aria-hidden="true">
                  <FontAwesomeIcon icon={icon({name: 'minus'})} />
                </span>
                <span className="mermaidViewerControlLabel">Zoom out</span>
              </button>
              <button
                type="button"
                className="mermaidActionButton mermaidZoomStatus button"
                onClick={resetViewerZoom}
                aria-label="Reset Mermaid diagram zoom"
                title="Reset zoom"
              >
                <span>{viewerZoomPercent}%</span>
              </button>
              <button
                type="button"
                className={viewerControlButtonClassName}
                onClick={increaseViewerZoom}
                aria-label="Zoom in Mermaid diagram"
                title="Zoom in"
                disabled={viewerZoom >= MERMAID_VIEWER_MAX_ZOOM}
              >
                <span className="icon is-small" aria-hidden="true">
                  <FontAwesomeIcon icon={icon({name: 'plus'})} />
                </span>
                <span className="mermaidViewerControlLabel">Zoom in</span>
              </button>
            </div>
            <button
              type="button"
              className={viewerControlButtonClassName}
              onClick={toggleViewerRotation}
              aria-label={isViewerRotated ?
                'Show Mermaid diagram without rotation' :
                'Rotate Mermaid diagram within fullscreen viewer'}
              title={isViewerRotated ? 'Unrotate' : 'Rotate'}
            >
              <span className="icon is-small" aria-hidden="true">
                <FontAwesomeIcon icon={icon({name: 'rotate'})} />
              </span>
              <span className="mermaidViewerControlLabel">
                {isViewerRotated ? 'Unrotate' : 'Rotate'}
              </span>
            </button>
            <button
              type="button"
              className={viewerControlButtonClassName}
              onClick={closeViewer}
              aria-label="Close Mermaid diagram viewer"
              title="Close"
            >
              <span className="icon is-small" aria-hidden="true">
                <FontAwesomeIcon icon={icon({name: 'xmark'})} />
              </span>
              <span className="mermaidViewerControlLabel">Close</span>
            </button>
          </div>
        </div>
        <div className="mermaidViewerBody">
          <div
            ref={viewerCanvasRef}
            className="mermaidViewerCanvas"
            data-pannable={viewerIsPannable}
            data-panning={isViewerPanning}
            data-rotated={isViewerRotated}
            data-zoom={viewerZoomPercent}
            onPointerCancel={stopViewerPanning}
            onPointerDown={startViewerPanning}
            onPointerLeave={stopViewerPanning}
            onPointerMove={panViewer}
            onPointerUp={stopViewerPanning}
          >
            <div
              className="mermaidViewerPositioner"
              style={{
                width: `${positionerWidth}px`,
                height: `${positionerHeight}px`,
              }}
              data-overflow-x={viewerHasHorizontalOverflow}
              data-overflow-y={viewerHasVerticalOverflow}
            >
              <div
                className="mermaidViewerStage"
                style={{
                  left: `${stageOffsetLeft}px`,
                  top: `${stageOffsetTop}px`,
                  width: `${stageWidth}px`,
                  height: `${stageHeight}px`,
                }}
              >
                <div
                  className="mermaidViewerTransform"
                  style={{
                    height: `${contentHeight}px`,
                    transform: rotationTransform,
                    width: `${contentWidth}px`,
                  }}
                >
                  <div
                    ref={modalRenderedRef}
                    className="mermaidRendered mermaidViewerRendered"
                    style={{
                      height: `${Math.max(
                          Math.round(modalSvgSize.naturalHeight * totalScale),
                          1,
                      )}px`,
                      transform: renderedTransform,
                      width: `${Math.max(
                          Math.round(modalSvgSize.naturalWidth * totalScale),
                          1,
                      )}px`,
                    }}
                    dangerouslySetInnerHTML={{__html: modalSvg}}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
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
