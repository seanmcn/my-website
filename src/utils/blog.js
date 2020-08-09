export function getPostsFromQuery () {}

export function slugToTitle (str) {
  const capitalisationOverride = {
    'Css': 'CSS',
    'Cms': 'CMS',
    'Gpg': 'GPG',
    'Jquery': 'jQuery',
    'Nginx': 'nginx',
    'Pear': 'PEAR',
    'Php': 'PHP',
    'Phpstorm' :' PHPStorm',
    'Pyrocms': 'PyroCMS',
    'Rts': 'RTS',
  };

  const splitStr = str.toLowerCase().split('-');
  for (let i = 0; i < splitStr.length; i++) {
    // Remove `-` symbol and upper case first letter of each word
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    // Check if we have an over-ride in place on the word, if so apply it.
    if (splitStr[i] in capitalisationOverride) {
      splitStr[i] = capitalisationOverride[splitStr[i]];
    }
  }

  return splitStr.join(' ');
}
