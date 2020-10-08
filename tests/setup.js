const fs = require('fs');
const path = require('path');
const os = require('os');
const fixtures = require('./fixtures');
const credentials = require('../lib/credentials');

const homeDir = os.homedir();

global.beforeEach(async () => {
  await credentials.set({
    url: 'postgres://postgres:password@localhost/konsole_test',
    token: 'azerty',
  });
  await fixtures.clean();
  return fixtures.insert();
});

global.afterAll(() => {
  fs.unlinkSync(homeDir + '/.konsole.test.json');
});
