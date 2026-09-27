const NOTE_COMPONENTS = new Set(['StickyNote', 'StickyStack']);

function isNote(node) {
  return node?.type === 'mdxJsxFlowElement' && NOTE_COMPONENTS.has(node.name);
}

function createPairNode(children) {
  return {
    type: 'mdxJsxFlowElement',
    name: 'div',
    attributes: [
      {
        type: 'mdxJsxAttribute',
        name: 'className',
        value: 'stickyPair',
      },
    ],
    children,
  };
}

/*
 * Sticky notes are written just before the block they annotate, so that on
 * wide screens they float beside it from its first line. On a phone there
 * is no room beside it, and a note sitting above the block reads before the
 * thing it comments on. Wrapping each note (or run of consecutive notes)
 * together with the block after it lets CSS swap the two there, while the
 * wrapper steps out of the layout (display: contents) everywhere else so
 * the float behaves exactly as if it weren't there. See .stickyPair in
 * content.scss.
 */
export default function remarkStickyPairs() {
  return function transformer(tree) {
    if (!tree || !Array.isArray(tree.children)) {
      return tree;
    }

    const children = [];
    let index = 0;

    while (index < tree.children.length) {
      if (!isNote(tree.children[index])) {
        children.push(tree.children[index]);
        index += 1;
        continue;
      }

      let end = index;
      while (isNote(tree.children[end])) {
        end += 1;
      }

      const annotated = tree.children[end];

      if (!annotated) {
        children.push(...tree.children.slice(index));
        break;
      }

      children.push(createPairNode(tree.children.slice(index, end + 1)));
      index = end + 1;
    }

    tree.children = children;

    return tree;
  };
}
