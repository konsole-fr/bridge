const fs = require('fs');
const path = require('path');
const fixtures = require('./fixtures');
const credentials = require('../lib/credentials');

global.beforeEach(async () => {
  await credentials.set({
    url: 'postgres://postgres:@localhost/konsole_test',
    token: 'azerty',
  });
  await fixtures.clean();
  return fixtures.insert();
});
