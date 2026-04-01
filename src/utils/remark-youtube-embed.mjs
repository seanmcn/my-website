const YOUTUBE_HOSTS = new Set([
  'youtu.be',
  'www.youtu.be',
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
]);

function getYouTubeEmbedUrl(url) {
  let parsedUrl;

  try {
    parsedUrl = new URL(url);
  } catch {
    return null;
  }

  if (!YOUTUBE_HOSTS.has(parsedUrl.hostname)) {
    return null;
  }

  let videoId = '';

  if (parsedUrl.hostname.includes('youtu.be')) {
    videoId = parsedUrl.pathname.slice(1);
  } else if (parsedUrl.pathname === '/watch') {
    videoId = parsedUrl.searchParams.get('v') || '';
  } else if (parsedUrl.pathname.startsWith('/embed/')) {
    videoId = parsedUrl.pathname.split('/')[2] || '';
  } else if (parsedUrl.pathname.startsWith('/shorts/')) {
    videoId = parsedUrl.pathname.split('/')[2] || '';
  }

  if (!videoId) {
    return null;
  }

  return `https://www.youtube.com/embed/${videoId}`;
}

function getParagraphUrl(node) {
  if (!node || node.type !== 'paragraph' || node.children.length !== 1) {
    return null;
  }

  const [child] = node.children;

  if (child.type === 'link') {
    return child.url;
  }

  if (child.type === 'text') {
    return child.value.trim();
  }

  return null;
}

function createEmbedNode(embedUrl) {
  return {
    type: 'mdxJsxFlowElement',
    name: 'div',
    attributes: [
      {
        type: 'mdxJsxAttribute',
        name: 'className',
        value: 'videoEmbed',
      },
    ],
    children: [
      {
        type: 'mdxJsxFlowElement',
        name: 'iframe',
        attributes: [
          {
            type: 'mdxJsxAttribute',
            name: 'src',
            value: embedUrl,
          },
          {
            type: 'mdxJsxAttribute',
            name: 'title',
            value: 'Embedded YouTube video',
          },
          {
            type: 'mdxJsxAttribute',
            name: 'allow',
            value: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
          },
          {
            type: 'mdxJsxAttribute',
            name: 'allowFullScreen',
            value: true,
          },
        ],
        children: [],
      },
    ],
  };
}

export default function remarkYouTubeEmbed() {
  return function transformer(tree) {
    if (!tree || !Array.isArray(tree.children)) {
      return tree;
    }

    tree.children = tree.children.map(node => {
      const paragraphUrl = getParagraphUrl(node);
      const embedUrl = paragraphUrl ? getYouTubeEmbedUrl(paragraphUrl) : null;

      if (!embedUrl) {
        return node;
      }

      return createEmbedNode(embedUrl);
    });

    return tree;
  };
}
