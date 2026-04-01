import React from 'react';
import {Link} from 'gatsby';
import './pagination.scss';
import {icon} from '@fortawesome/fontawesome-svg-core/import.macro';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const Pagination = ({pageContext}) => {
  const {previousPagePath, nextPagePath} = pageContext;
  const defaultLink = pageContext.paginate_link;
  const pageLink = `${defaultLink}/page`;

  // A sweet helper function to create pagination object
  const createPaginationObjects = (length, page, increment = 2) => Array
      .from({length}, (_, i) => ({
        link: `${pageLink}/${i + increment}/`,
        index: i + increment,
        current: page === i + increment,
      }));

  const pages = pageContext.numberOfPages;
  const page = pageContext.humanPageNumber;
  let navItems = [
    {
      link: defaultLink,
      index: 1,
      current: page === 1,
    },
  ];

  if (typeof pages === 'undefined' || pages === 1) {
    return '';
  }

  if (pages <= 5) {
    navItems = [
      ...navItems,
      ...Array.from({length: pages - 1}, (_, i) => ({
        link: `${pageLink}/${i + 2}/`,
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
          link: `${pageLink}/${pages}/`,
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
          link: `${pageLink}/${pages}/`,
          index: pages,
          current: false,
        },
      ];
    }
  }
  return (
    <section className="paginationShell">
      <nav
        className="pagination is-centered blogPagination"
        role="navigation"
        aria-label="pagination"
      >
        {previousPagePath && (
          <Link
            to={previousPagePath}
            rel="prev"
            className="pagination-previous blogPaginationNav"
            aria-label="Go to previous page"
          >
            <span className="icon">
              <FontAwesomeIcon icon={icon({name: 'chevron-left'})} />
            </span>
          </Link>
        )}
        {nextPagePath && (
          <Link
            to={nextPagePath}
            rel="next"
            className="pagination-next blogPaginationNav"
            aria-label="Go to next page">
            <span className="icon">
              <FontAwesomeIcon icon={icon({name: 'chevron-right'})} />
            </span>
          </Link>
        )}

        <ul className="pagination-list blogPaginationList">
          {navItems.map(item => (
            <li key={item.index}>
              {item.separator ? (
                <span className="pagination-ellipsis blogPaginationEllipsis">
                  &hellip;
                </span>
              ) : (
                <Link
                  to={item.link}
                  className={`pagination-link blogPaginationLink ${
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
