const fetch = require('node-fetch');

const fetchAPI = async (url) => {
  return fetch(url);
}

module.exports = {
  fetchAPI
}
