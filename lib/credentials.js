const fs = require('fs');
const path = require('path');

const fileName = process.env.NODE_ENV == 'test' ? '/.credentials.test.json' : '/.credentials.json';
const filePath = path.resolve('./') + fileName;

const get = async () => {
  if (fs.existsSync(filePath)) {
    let credentials = fs.readFileSync(filePath);
    credentials = JSON.parse(credentials.toString());
    return credentials;
  } else {
    throw new Error('No credentials found');
  }
};

const set = ({ url, token }) => {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ url, token });
    fs.writeFile(filePath, body, (err) => {
      if (err) return reject(err);
      resolve();
    }); 
  });
};

module.exports = {
  get,
  set,
};
