const fs = require('fs');
const path = require('path');
const credentials = require('../../lib/credentials');

const rootDir = path.resolve('./');

describe('Credentials', () => {
  describe('#get', () => {
    describe('when there is no credentials file', () => {
      test('rejects', () => {
        fs.unlinkSync(rootDir + '/.credentials.test.json');
        return expect(credentials.get()).rejects.toThrow('No credentials found')
      });
    });
    
    test('returns credentials as json', async () => {
      const data = await credentials.get();
      expect(data).toEqual({
        url: 'postgres://saidmimouni:@localhost/konsole_test',
        token: 'azerty',
      });
    });
  });

  describe('#set', () => {
    test('writes a hidden json file', async () => {
      await credentials.set({
        url: 'postgres://postgres:password@localhost/foo',
        token: 'qwerty',
      });
      fs.readFile(rootDir + '/.credentials.test.json', (err, data) => {
        if (err) throw err;
        const credentials = JSON.parse(data.toString());
        expect(credentials).toEqual({
          url: 'postgres://postgres:password@localhost/foo',
          token: 'qwerty',
        });
      });
    });
  });
});
