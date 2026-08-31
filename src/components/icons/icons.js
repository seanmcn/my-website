import React from 'react';
import PropTypes from 'prop-types';

/*
 * The small line icons the design uses in meta rows and rails. They are drawn
 * on a 14x14 grid at a 1.2 stroke so they sit on the same optical weight as the
 * mono labels beside them.
 */
const Icon = ({children, size, title, ...rest}) => (
  <svg
    aria-hidden={title ? undefined : 'true'}
    fill="none"
    height={size}
    role={title ? 'img' : undefined}
    stroke="currentColor"
    strokeWidth="1.2"
    viewBox="0 0 14 14"
    width={size}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}
  >
    {title ? <title>{title}</title> : null}
    {children}
  </svg>
);

Icon.propTypes = {
  children: PropTypes.node,
  size: PropTypes.number,
  title: PropTypes.string,
};

Icon.defaultProps = {
  size: 12,
};

export const CategoryIcon = props => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Icon {...props}>
    <path d="M1 3.2h4l1.3 1.6H13v7.2H1z" />
  </Icon>
);

export const CalendarIcon = props => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Icon {...props}>
    <rect x="1.6" y="3" width="10.8" height="9.4" />
    <path d="M1.6 5.9h10.8M4.4 1.4v2.4M9.6 1.4v2.4" />
  </Icon>
);

export const ClockIcon = props => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Icon {...props}>
    <circle cx="7" cy="7" r="5.4" />
    <path d="M7 4.2V7l2 1.4" />
  </Icon>
);

export const TagIcon = props => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Icon strokeLinejoin="round" {...props}>
    <path d="M7.4 1.2H12.8V6.6L6.6 12.8 1.2 7.4z" />
    <circle cx="10" cy="4" r="1" />
  </Icon>
);

export const ArrowLeftIcon = props => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Icon strokeWidth="1.4" {...props}>
    <path d="M6 2.5 1.5 7 6 11.5" />
    <path d="M1.8 7H12.5" />
  </Icon>
);

export const ReplyIcon = props => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Icon {...props}>
    <path d="M1.4 3.2h11.2v6.6H6.4L3.4 12V9.8H1.4z" />
  </Icon>
);

export const CopyIcon = props => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Icon strokeWidth="1.3" {...props}>
    <path d="M4.4 4.4V1.6h8v8H9.6" />
    <path d="M1.6 4.4h8v8h-8z" />
  </Icon>
);

export const SearchIcon = props => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Icon strokeWidth="1.4" {...props}>
    <circle cx="6.2" cy="6.2" r="4.4" />
    <path d="M9.5 9.5 12.6 12.6" />
  </Icon>
);

export default Icon;
