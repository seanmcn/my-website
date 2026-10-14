/*
 * Browser behaviour for rendered Markdown. Code blocks are highlighted at
 * build time (src/plugins/code-blocks.mjs); this wires up their copy buttons,
 * links each image to its full-size file, and hands Mermaid blocks to the
 * diagram renderer, which only loads when a page has one.
 */
const COPIED_FOR_MS = 1600;

document.querySelectorAll('.code-copy-button').forEach((button) => {
  let timer;
  const label = [...button.childNodes]
      .find(node => node.nodeType === Node.TEXT_NODE);

  button.addEventListener('click', async () => {
    const code = button.closest('.code-wrapper').querySelector('pre code');

    try {
      await navigator.clipboard.writeText(code.innerText);
    } catch (error) {
      return;
    }

    button.classList.add('is-copied');
    label.textContent = 'Copied';
    clearTimeout(timer);
    timer = setTimeout(() => {
      button.classList.remove('is-copied');
      label.textContent = 'Copy';
    }, COPIED_FOR_MS);
  });
});

// A Markdown image's src is its full-size file; the page itself may show a
// smaller one from its srcset (src/plugins/markdown.mjs).
document.querySelectorAll('.prose img').forEach((image) => {
  if (image.closest('a, figure, .sticky-note, .sticky-stack')) {
    return;
  }

  const link = document.createElement('a');
  link.className = 'prose-image-link';
  link.href = image.src;
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
