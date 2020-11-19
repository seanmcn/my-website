import React from 'react';
import { Link } from 'gatsby';

const Pagination = ({ pageContext }) => {
  const { previousPagePath, nextPagePath } = pageContext;

  // A sweet helper function to create pagination object
  const createPaginationObjects = (length, page, increment = 2) => Array
    .from({ length }, (_, i) => ({
      link: `/blog/page/${i + increment}/`,
      index: i + increment,
      current: page === i + increment,
    }));

  const pages = pageContext.numberOfPages;
  const page = pageContext.humanPageNumber;
  let navItems = [
    {
      link: '/blog/',
      index: 1,
      current: pages === 1,
    },
  ];

  if (typeof pages === 'undefined') {
    return '';
  }

  if (pages <= 5) {
    navItems = [
      ...navItems,
      ...Array.from({ length: pages - 1 }, (_, i) => ({
        link: `/blog/page/${i + 2}/`,
        index: i + 2,
        current: page === i + 2,
      })),
    ];
  } else {
    // We have a situation where we have to show the first
    // item, three items around the current one
    // and also the last item
    /* eslint-disable no-lonely-if */
    if (page <= 3) {
      // If the current one is closer to the start
      navItems = [
        ...navItems,
        ...createPaginationObjects(3, page),
        {
          separator: true,
          index: 'starter-separator',
        },
        {
          link: `/blog/page/${pages}/`,
          index: pages,
          current: false,
        },
      ];
    } else if (page > pages - 3) {
      // If the current one is closer to the last one
      navItems = [
        ...navItems,
        {
          separator: true,
          index: 'finisher-separator',
        },
        ...createPaginationObjects(4, page, pages - 3),
      ];
    } else {
      navItems = [
        ...navItems,
        {
          separator: true,
          index: 'starter-separator',
        },
        ...createPaginationObjects(3, page, page - 1),
        {
          separator: true,
          index: 'finisher-separator',
        },
        {
          link: `/blog/page/${pages}/`,
          index: pages,
          current: false,
        },
      ];
    }
  }
  return (
    <section>
      <br />
      <nav
        className="pagination is-centered navbar"
        role="navigation"
        aria-label="pagination"
      >
        {previousPagePath && (
          <Link
            to={previousPagePath}
            rel="next"
            className="pagination-previous"
          >
            Previous
          </Link>
        )}
        {nextPagePath && (
          <Link to={nextPagePath} rel="next" className="pagination-next">
            Next
          </Link>
        )}

        <ul className="pagination-list">
          {navItems.map(item => (
            <li key={item.index}>
              {item.separator ? (
                <span className="pagination-ellipsis">&hellip;</span>
              ) : (
                <Link
                  to={item.link}
                  className={`pagination-link ${
                    item.current ? 'is-current' : ''
                  }`}
                  aria-label={`Goto page ${item.index}`}
                >
                  {item.index}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
};

export default Pagination;
