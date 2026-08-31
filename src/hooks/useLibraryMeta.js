import {graphql, useStaticQuery} from 'gatsby';

/*
 * Site-wide facts the chrome needs on every page: how many items of each kind
 * exist, the categories and tags with their counts, and the span of years the
 * footer prints. One static query rather than a per-template one, because the
 * header, footer and every rail want the same numbers.
 */
export default function useLibraryMeta() {
  const data = useStaticQuery(graphql`
    query LibraryMetaQuery {
      allMdx(
        filter: {
          fields: {sourceInstanceName: {eq: "blog"}, visible: {eq: true}}
        }
        sort: {frontmatter: {date: DESC}}
      ) {
        nodes {
          fields {
            itemType
            readingTime
          }
          frontmatter {
            category
            date
            tags
          }
        }
      }
    }
  `);

  const nodes = data.allMdx.nodes;
  const counts = {all: nodes.length, post: 0, note: 0, find: 0};
  const categoryCounts = new Map();
  const tagCounts = new Map();
  let readMinutes = 0;
  let earliest = null;
  let latest = null;

  nodes.forEach((node) => {
    const itemType = node.fields?.itemType || 'post';
    counts[itemType] = (counts[itemType] || 0) + 1;

    if (itemType !== 'find') {
      readMinutes += node.fields?.readingTime || 0;
    }

    const category = node.frontmatter.category;
    if (category) {
      categoryCounts.set(category, (categoryCounts.get(category) || 0) + 1);
    }

    (node.frontmatter.tags || []).forEach((tag) => {
      if (tag) {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      }
    });

    const year = new Date(node.frontmatter.date).getUTCFullYear();
    if (!Number.isNaN(year)) {
      earliest = earliest === null ? year : Math.min(earliest, year);
      latest = latest === null ? year : Math.max(latest, year);
    }
  });

  const byCount = (left, right) =>
    right.count - left.count || left.name.localeCompare(right.name);

  return {
    categories: Array.from(categoryCounts, ([name, count]) => ({name, count}))
        .sort((left, right) => left.name.localeCompare(right.name)),
    counts,
    readMinutes,
    tags: Array.from(tagCounts, ([name, count]) => ({name, count}))
        .sort(byCount),
    yearRange: earliest && latest ? `${earliest}–${latest}` : '',
  };
}
