const fixtures = require('./fixtures');

global.beforeEach(async () => {
  await fixtures.clean();
  return fixtures.insert();
});
