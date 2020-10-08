const fs = require('fs');
const path = require('path');
const os = require('os');
const credentials = require('../../lib/credentials');

const homeDir = os.homedir();

describe('Credentials', () => {
  describe('#exists', () => {
    describe('when there is no credentials file', () => {
      test('return false', () => {
        fs.unlinkSync(homeDir + '/.konsole.test.json');
        expect(credentials.exists()).toEqual(false);
      });
    });
    
    test('returns credentials as json', () => {
      expect(credentials.exists()).toEqual(true);
    });
  });

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
        url: 'postgres://postgres:password@localhost/konsole_test',
        token: 'azerty',
      });
    });
  });

  describe('#set', () => {
    test('writes a hidden json file', async () => {
      await credentials.set({
        url: 'postgres://postgres:password@localhost/konsole_test',
        token: 'qwerty',
      });
      fs.readFile(homeDir + '/.konsole.test.json', (err, data) => {
        if (err) throw err;
        const credentials = JSON.parse(data.toString());
        expect(credentials).toEqual({
          url: 'postgres://postgres:password@localhost/konsole_test',
          token: 'qwerty',
        });
      });
    });
  });
});
