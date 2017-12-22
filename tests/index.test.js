const fs = require('fs');
const yamlToIntl = require('..');

const outputFilePath = './tests/support/locales.js';

describe('yamlToIntl', () => {
  beforeAll(() => {
    fs.unlink(outputFilePath)
  });

  beforeEach(() => {
    global.console.error = jest.fn();
  });

  it('returns an error message', () => {
    expect(yamlToIntl('./tests/support/**/*.yml', {output: outputFilePath})).toBeTruthy();
    expect(console.error).not.toHaveBeenCalled();

    fs.readFileSync(outputFilePath, (err, data) => {
      expect(data).toEqual('alex');
    });
  });

  describe('errors', () => {
    describe('without input', () => {
      it('returns an error message', () => {
        expect(yamlToIntl()).toBeFalsy();
        expect(console.error).toHaveBeenCalledWith('Error ! Please specify an input directory.');
        expect(console.error).toHaveBeenCalledTimes(1);
      });
    });

    describe('without options', () => {
      it('returns an error message', () => {
        expect(yamlToIntl('./support/locales/**/*.yml')).toBeFalsy();
        expect(console.error).toHaveBeenCalledWith('Error ! No options provided.');
        expect(console.error).toHaveBeenCalledTimes(1);
      });
    });

    describe('without an output file', () => {
      it('returns an error message', () => {
        expect(yamlToIntl('./support/locales/**/*.yml', {})).toBeFalsy();
        expect(console.error).toHaveBeenCalledWith('Error ! Please specify an output file.');
        expect(console.error).toHaveBeenCalledTimes(1);
      });
    });
  });
});
