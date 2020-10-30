const baseURL = ()  => {
  return process.env.NODE_ENV == 'production' ? 'https://www.konsole.fr' : 'http://lvh.me:3000';
};

module.exports = {
  baseURL,
};
