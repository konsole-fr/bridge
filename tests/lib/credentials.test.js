const fs = require('fs');
const path = require('path');
const os = require('os');
const credentials = require('../../lib/credentials');

const homeDir = os.homedir();

describe('Credentials', () => {
  describe('#get', () => {
    describe('when there is no credentials file', () => {
      test('rejects', () => {
        fs.unlinkSync(homeDir + '/.konsole.test.json');
        return expect(credentials.get()).rejects.toThrow('No credentials found')
      });
    });
    
    test('returns credentials as json', async () => {
      const data = await credentials.get();
      expect(data).toEqual({
        url: 'postgres://postgres:@localhost/konsole_test',
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
      fs.readFile(homeDir + '/.konsole.test.json', (err, data) => {
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
