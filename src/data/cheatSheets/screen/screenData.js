const screenData = [
  {
    command: 'screen',
    category: 'Basic',
    description: 'Starts a new session',
  },
  {
    command: 'screen -S <session_name>',
    category: 'Basic',
    description: 'Starts a new session with session name',
  },
  {
    command: 'screen -ls',
    category: 'Basic',
    description: 'Lists running screen sessions',
  },
  {
    command: 'screen -r <session_name>',
    category: 'Basic',
    description: 'Attach to a running session with name',
  },
  {
    command: 'screen -d <session_name>',
    category: 'Basic',
    description: 'Detach a running session with name',
  },
  {
    command: 'screen -r -d <session_name>',
    category: 'Basic',
    description: 'Attach to a screen that is already attached',
  },
  {
    command: 'Ctrl-a d',
    category: 'Exiting',
    description: 'Detach',
  },
  {
    command: 'Ctrl-a D D',
    category: 'Exiting',
    description: 'Detach and logout (fast way to exit screen)',
  },
  {
    command: 'Ctrl-a :',
    category: 'Exiting',
    description: 'Quit and exits all of the programs in screen',
  },
  {
    command: 'Ctrl-a esc',
    category: 'Scrolling',
    description: 'Enter scrolling mode',
  },
  {
    command: 'Ctrl-u',
    category: 'Scrolling',
    description: 'Scroll Up',
  },
  {
    command: 'Ctrl-d',
    category: 'Scrolling',
    description: 'Scroll Down',
  },
  {
    command: 'esc esc',
    category: 'Scrolling',
    description: 'Exit scrolling mode',
  },
  {
    command: 'Ctrl-a c',
    category: 'Window Management',
    description: 'Create new window',
  },
  {
    command: 'Ctrl-a Ctrl-a',
    category: 'Window Management',
    description: 'Change to last-visited active window',
  },
  {
    command: 'Ctrl-a <number>',
    category: 'Window Management',
    description: 'Change to window by number (only 0-9)',
  },
  {
    command: 'Ctrl-a \' <number_or_name>',
    category: 'Window Management',
    description: 'Change to window by number or name',
  },
  {
    command: 'Ctrl-a n',
    category: 'Window Management',
    description: 'Change to next window in list',
  },
  {
    command: 'Ctrl-a p',
    category: 'Window Management',
    description: 'Change to previous window in list',
  },
  {
    command: 'Ctrl-a "',
    category: 'Window Management',
    description: 'Displays list of windows, allowing to ' +
      'select window to change into',
  },
  {
    command: 'Ctrl-a A',
    category: 'Window Management',
    description: 'Rename current window',
  },
  {
    command: 'Ctrl-a k',
    category: 'Window Management',
    description: 'Kill current window',
  },
  {
    command: 'Ctrl-a \\',
    category: 'Window Management',
    description: 'Kill all windows',
  },
  {
    command: 'Ctrl-a a',
    category: 'Misc',
    description: 'Send Ctrl-A to screen within screen, useful when ' +
      'working with screen within screen',
  },
];

export default screenData;
