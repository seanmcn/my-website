const getHTML = url => `<iframe class="embedChatGPT" src="${url}"></iframe>`;

const name = 'chatGPT';

const regex = /^https?:\/\/chat\.openai\.com\//;
const shouldTransform = url => regex.test(url);

module.exports = {getHTML, name, shouldTransform};
