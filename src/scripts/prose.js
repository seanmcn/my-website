/*
 * Browser behaviour for rendered Markdown. Code blocks are highlighted at
 * build time (src/plugins/code-blocks.mjs); this wires up their copy buttons,
 * links each image to its full-size file, and hands Mermaid blocks to the
 * diagram renderer, which only loads when a page has one.
 */
const COPIED_FOR_MS = 1600;

document.querySelectorAll('.codeCopyButton').forEach((button) => {
  let timer;
  const label = [...button.childNodes]
      .find(node => node.nodeType === Node.TEXT_NODE);

  button.addEventListener('click', async () => {
    const code = button.closest('.codeWrapper').querySelector('pre code');

    try {
      await navigator.clipboard.writeText(code.innerText);
    } catch (error) {
      return;
    }

    button.classList.add('isCopied');
    label.textContent = 'Copied';
    clearTimeout(timer);
    timer = setTimeout(() => {
      button.classList.remove('isCopied');
      label.textContent = 'Copy';
    }, COPIED_FOR_MS);
  });
});

// Astro serves Markdown images at their own size, so the file the page shows
// is also the full-size one worth opening on its own.
document.querySelectorAll('.prose img').forEach((image) => {
  if (image.closest('a, figure, .stickyNote, .stickyStack')) {
    return;
  }

  const link = document.createElement('a');
  link.className = 'proseImageLink';
  link.href = image.currentSrc || image.src;
  link.target = '_blank';
  link.rel = 'noopener';
  image.replaceWith(link);
  link.append(image);
});

const diagrams = document.querySelectorAll(
    'pre[data-language="mermaid"], pre > code.language-mermaid',
);

if (diagrams.length) {
  import('./mermaid.js').then(({renderDiagrams}) => renderDiagrams(diagrams));
}
