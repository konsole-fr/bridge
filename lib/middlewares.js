const credentials = require('./credentials');
const { baseURL } = require('./helpers');

const ensureXhr = (req, res, next) => {
  if (req.method == 'OPTIONS' || req.method == 'POST' || req.method == 'DELETE') {
    return next();
  }
  if (req.path == '/api/tables') {
    return next();
  }
  if (req.method == 'GET' && req.path.match(/\/api\/tables\/.+\/columns/)) {
    return next();
  }
  if (!req.xhr) {
    return next(new Error(req.method + ' request is not xhr' + req.path));
  }
  next();
};

const authenticate = async (req, res, next) => {
  if (req.method == 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', baseURL());
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    return next();
  }
  if (!req.token) {
    const { token } = await credentials.get();
    req.token = token;
  }
  if (!req.get('authorization')) {
    return next(new Error('missing authorization token'));
  }
  const bearer = req.get('authorization').replace(/Bearer /, '');
  if (bearer != req.token) {
    return next(new Error('invalid authorization token'));
  }
  next();
};

const cors = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', baseURL());
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
};

module.exports = {
  authenticate,
  ensureXhr,
  cors,
};
