import {iconSvg} from '../components/icons/icons.js';

/*
 * Mermaid diagrams: each ```mermaid block is drawn in the page, redrawn when
 * the theme changes, and can be opened in a fullscreen viewer with zoom,
 * pan and a rotate toggle for narrow screens. The source stays in the page as
 * the fallback until the drawing succeeds.
 */

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 6;
const ZOOM_STEP = 0.25;
const FIT_MARGIN = 0.96;
const FONT = 'Raleway, Century Gothic, CenturyGothic, AppleGothic, sans-serif';

const THEME_VARIABLES = {
  dark: {
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
    fontFamily: FONT,
  },
  light: {
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
    fontFamily: FONT,
  },
};

let mermaidPromise;
let idCounter = 0;

async function render(source, id) {
  mermaidPromise ??= import('mermaid').then(module => module.default);
  const mermaid = await mermaidPromise;
  const theme = document.documentElement.dataset.theme === 'dark' ?
    'dark' :
    'light';

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: 'base',
    themeVariables: THEME_VARIABLES[theme],
  });

  return (await mermaid.render(id, source.trim())).svg;
}

function svgSize(svg) {
  const viewBox = svg.match(
      /viewBox="[-\d.]+\s+[-\d.]+\s+([\d.]+)\s+([\d.]+)"/i,
  );

  if (viewBox) {
    return {
      width: Math.max(Number(viewBox[1]) || 1, 1),
      height: Math.max(Number(viewBox[2]) || 1, 1),
    };
  }

  return {
    width: Math.max(Number(svg.match(/width="([\d.]+)/i)?.[1]) || 1, 1),
    height: Math.max(Number(svg.match(/height="([\d.]+)/i)?.[1]) || 1, 1),
  };
}

function element(tag, className, attributes = {}) {
  const node = document.createElement(tag);
  if (className) {
    node.className = className;
  }
  Object.entries(attributes).forEach(([key, value]) => {
    node.setAttribute(key, value);
  });
  return node;
}

function controlButton(iconName, label, ariaLabel) {
  const button = element('button',
      'mermaid-action-button mermaid-viewer-control-button button', {
        'type': 'button',
        'aria-label': ariaLabel,
        'title': label,
      });
  button.innerHTML = `<span class="icon is-small" aria-hidden="true">${
    iconSvg(iconName, {size: 14})}</span>` +
    `<span class="mermaid-viewer-control-label">${label}</span>`;
  return button;
}

/*
 * The fullscreen viewer. One per page, reused for each diagram. Laid out in
 * the same overlay-and-dialog structure the React version used, so
 * code.scss applies unchanged.
 */
function createViewer() {
  const overlay = element('div', 'mermaid-viewer-overlay');
  const modal = element('div', 'mermaid-viewer-modal', {
    'role': 'dialog',
    'aria-modal': 'true',
    'aria-label': 'Fullscreen Mermaid diagram',
    'tabindex': '-1',
  });
  const header = element('div', 'mermaid-viewer-header');
  header.innerHTML = '<div>' +
    '<h2 class="mermaid-viewer-title">Diagram viewer</h2>' +
    '<p class="mermaid-viewer-subtitle">Rotate for a wider layout on narrow ' +
    'screens.</p></div>';

  const actions = element('div', 'mermaid-viewer-actions');
  const zoomControls = element('div', 'mermaid-zoom-controls', {
    'role': 'group',
    'aria-label': 'Diagram zoom controls',
  });
  const zoomOut = controlButton('minus', 'Zoom out',
      'Zoom out Mermaid diagram');
  const zoomStatus = element('button',
      'mermaid-action-button mermaid-zoom-status button', {
        'type': 'button',
        'aria-label': 'Reset Mermaid diagram zoom',
        'title': 'Reset zoom',
      });
  const zoomIn = controlButton('plus', 'Zoom in', 'Zoom in Mermaid diagram');
  const rotate = controlButton('rotate', 'Rotate',
      'Rotate Mermaid diagram within fullscreen viewer');
  const close = controlButton('close', 'Close', 'Close Mermaid diagram viewer');
  zoomControls.append(zoomOut, zoomStatus, zoomIn);
  actions.append(zoomControls, rotate, close);
  header.append(actions);

  const body = element('div', 'mermaid-viewer-body');
  const canvas = element('div', 'mermaid-viewer-canvas');
  const positioner = element('div', 'mermaid-viewer-positioner');
  const stage = element('div', 'mermaid-viewer-stage');
  const transform = element('div', 'mermaid-viewer-transform');
  const rendered = element('div', 'mermaid-rendered mermaid-viewer-rendered');
  transform.append(rendered);
  stage.append(transform);
  positioner.append(stage);
  canvas.append(positioner);
  body.append(canvas);
  modal.append(header, body);
  overlay.append(modal);

  const state = {
    open: false,
    zoom: 1,
    rotated: false,
    svg: '',
    bounds: null,
    canvasSize: {width: 0, height: 0},
    pan: null,
    returnFocus: null,
  };
  let resizeObserver;

  function layout() {
    const natural = svgSize(state.svg);
    const size = state.bounds || {...natural, x: 0, y: 0};
    const fitWidth = state.rotated ? size.height : size.width;
    const fitHeight = state.rotated ? size.width : size.height;
    const baseScale = Math.min(
        state.canvasSize.width / fitWidth || 1,
        state.canvasSize.height / fitHeight || 1,
    ) * FIT_MARGIN;
    const scale = baseScale * state.zoom;
    const contentWidth = Math.max(Math.round(size.width * scale), 1);
    const contentHeight = Math.max(Math.round(size.height * scale), 1);
    const stageWidth = state.rotated ? contentHeight : contentWidth;
    const stageHeight = state.rotated ? contentWidth : contentHeight;
    const overflowX = stageWidth > state.canvasSize.width;
    const overflowY = stageHeight > state.canvasSize.height;
    const positionerWidth = Math.max(stageWidth, state.canvasSize.width);
    const positionerHeight = Math.max(stageHeight, state.canvasSize.height);
    const percent = Math.round(state.zoom * 100);

    modal.classList.toggle('is-rotated', state.rotated);
    canvas.dataset.pannable = String(state.zoom > 1 || overflowX || overflowY);
    canvas.dataset.panning = String(Boolean(state.pan));
    canvas.dataset.rotated = String(state.rotated);
    canvas.dataset.zoom = String(percent);
    positioner.dataset.overflowX = String(overflowX);
    positioner.dataset.overflowY = String(overflowY);
    Object.assign(positioner.style, {
      width: `${positionerWidth}px`,
      height: `${positionerHeight}px`,
    });
    Object.assign(stage.style, {
      left: `${overflowX ? 0 :
        Math.max(Math.round((positionerWidth - stageWidth) / 2), 0)}px`,
      top: `${overflowY ? 0 :
        Math.max(Math.round((positionerHeight - stageHeight) / 2), 0)}px`,
      width: `${stageWidth}px`,
      height: `${stageHeight}px`,
    });
    Object.assign(transform.style, {
      width: `${contentWidth}px`,
      height: `${contentHeight}px`,
      transform: state.rotated ?
        `translate(0, ${contentWidth}px) rotate(-90deg)` :
        'none',
    });
    Object.assign(rendered.style, {
      width: `${Math.max(Math.round(natural.width * scale), 1)}px`,
      height: `${Math.max(Math.round(natural.height * scale), 1)}px`,
      transform: `translate(${Math.round(-size.x * scale)}px, ` +
        `${Math.round(-size.y * scale)}px)`,
    });
    zoomStatus.innerHTML = `<span>${percent}%</span>`;
    zoomOut.disabled = state.zoom <= MIN_ZOOM;
    zoomIn.disabled = state.zoom >= MAX_ZOOM;
    rotate.title = state.rotated ? 'Unrotate' : 'Rotate';
    rotate.setAttribute('aria-label', state.rotated ?
      'Show Mermaid diagram without rotation' :
      'Rotate Mermaid diagram within fullscreen viewer');
    rotate.querySelector('.mermaid-viewer-control-label').textContent =
      state.rotated ? 'Unrotate' : 'Rotate';

    if (state.zoom === 1) {
      requestAnimationFrame(() => canvas.scrollTo({left: 0, top: 0}));
    }
  }

  function measureCanvas() {
    const style = getComputedStyle(canvas);
    const width = canvas.clientWidth - parseFloat(style.paddingLeft) -
      parseFloat(style.paddingRight);
    const height = canvas.clientHeight - parseFloat(style.paddingTop) -
      parseFloat(style.paddingBottom);

    if (width > 0 && height > 0) {
      state.canvasSize = {width, height};
      layout();
    }
  }

  function setZoom(zoom) {
    state.zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));
    layout();
  }

  function stopPanning() {
    state.pan = null;
    canvas.dataset.panning = 'false';
  }

  function onKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      hide();
    } else if (event.key === 'Tab') {
      // Keep focus inside the dialog while it's open.
      const focusable = [...modal.querySelectorAll('button:not(:disabled)')];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  function show(svg, trigger) {
    state.open = true;
    state.zoom = 1;
    state.rotated = false;
    state.svg = svg;
    state.bounds = null;
    state.returnFocus = trigger;
    rendered.innerHTML = svg;
    document.body.append(overlay);
    document.addEventListener('keydown', onKeyDown);
    modal.focus();

    screen.orientation?.lock?.('landscape').catch(() => {});

    resizeObserver = new ResizeObserver(measureCanvas);
    resizeObserver.observe(canvas);

    requestAnimationFrame(() => {
      const box = rendered.querySelector('svg')?.getBBox();
      const natural = svgSize(svg);

      state.bounds = {
        width: Math.max(box?.width || natural.width, 1),
        height: Math.max(box?.height || natural.height, 1),
        x: box?.x || 0,
        y: box?.y || 0,
      };
      measureCanvas();
    });
  }

  function hide() {
    if (!state.open) {
      return;
    }

    state.open = false;
    stopPanning();
    resizeObserver?.disconnect();
    screen.orientation?.unlock?.();
    document.removeEventListener('keydown', onKeyDown);
    overlay.remove();
    state.returnFocus?.focus();
  }

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      hide();
    }
  });
  close.addEventListener('click', hide);
  zoomOut.addEventListener('click', () => setZoom(state.zoom - ZOOM_STEP));
  zoomIn.addEventListener('click', () => setZoom(state.zoom + ZOOM_STEP));
  zoomStatus.addEventListener('click', () => {
    stopPanning();
    setZoom(1);
  });
  rotate.addEventListener('click', () => {
    stopPanning();
    state.rotated = !state.rotated;
    layout();
  });

  canvas.addEventListener('pointerdown', (event) => {
    if (state.zoom <= 1 || event.pointerType === 'touch') {
      return;
    }

    state.pan = {
      pointerId: event.pointerId,
      left: canvas.scrollLeft,
      top: canvas.scrollTop,
      x: event.clientX,
      y: event.clientY,
    };
    canvas.setPointerCapture(event.pointerId);
    canvas.dataset.panning = 'true';
  });
  canvas.addEventListener('pointermove', (event) => {
    if (!state.pan || state.pan.pointerId !== event.pointerId) {
      return;
    }

    canvas.scrollLeft = state.pan.left - (event.clientX - state.pan.x);
    canvas.scrollTop = state.pan.top - (event.clientY - state.pan.y);
  });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach((type) => {
    canvas.addEventListener(type, stopPanning);
  });

  return {show};
}

let viewer;

async function draw(diagram) {
  const {wrapper, source, inline} = diagram;
  idCounter += 1;

  try {
    diagram.svg = await render(source, `mermaid-diagram-${idCounter}`);
    inline.innerHTML = diagram.svg;
    wrapper.dataset.mermaidState = 'rendered';
    wrapper.querySelector('.mermaid-fallback').setAttribute('aria-hidden',
        'true');
    diagram.expand.hidden = false;
  } catch (error) {
    console.error('Failed to render Mermaid diagram', error);
    inline.innerHTML = '';
    wrapper.dataset.mermaidState = 'error';
    diagram.expand.hidden = true;
  }
}

export function renderDiagrams(blocks) {
  const diagrams = [...blocks].map((block) => {
    const pre = block.closest('pre');
    const source = pre.textContent;
    const wrapper = element('div', 'code-wrapper mermaid-wrapper', {
      'data-language': 'mermaid',
      'data-mermaid-state': 'pending',
    });
    const expand = element('button',
        'mermaid-action-button mermaid-expand-button button is-small', {
          'type': 'button',
          'aria-label': 'Open Mermaid diagram in fullscreen viewer',
        });
    expand.innerHTML = `<span class="icon is-small" aria-hidden="true">${
      iconSvg('expand', {size: 14})}</span><span>Fullscreen</span>`;
    expand.hidden = true;
    const inline = element('div', 'mermaid-rendered');
    const fallback = element('pre', 'mermaid-fallback',
        {'aria-hidden': 'false'});
    const code = document.createElement('code');
    code.textContent = source;
    fallback.append(code);
    wrapper.append(expand, inline, fallback);
    pre.replaceWith(wrapper);

    const diagram = {wrapper, source, inline, expand, svg: ''};

    expand.addEventListener('click', async () => {
      viewer ??= createViewer();
      // The viewer gets its own drawing so its ids never clash with the page's.
      idCounter += 1;
      viewer.show(await render(source, `mermaid-diagram-modal-${idCounter}`),
          expand);
    });

    return diagram;
  });

  diagrams.forEach(draw);

  // Redraw in the new palette when the reader switches theme.
  new MutationObserver(() => diagrams.forEach(draw))
      .observe(document.documentElement, {attributeFilter: ['data-theme']});
}
