const fs = require('fs');
const {testErrors, unlinkGeneratedFiles} = require('./support/helpers');
const yamlToIntl = require('..');

const outputFileContent = "export default {\"en\":{\"hello\":\"hello\",\"goodybyes.see_ya\":\"see you later\"},\"fr\":{\"hello\":\"bonjour\",\"goodybyes.see_ya\":\"à la prochaine\"}}";
const outputFilePath = './tests/support/locales.js';

describe('yamlToIntl', () => {
  beforeEach(() => {
    global.console.error = jest.fn();
    global.console.log = jest.fn();

    unlinkGeneratedFiles(outputFilePath);
  });

  afterAll(() => {
    unlinkGeneratedFiles(outputFilePath);
  });

  describe('default', () => {
    it('creates the output file', () => (
      yamlToIntl('./tests/support/**/*.yml', {output: outputFilePath}).then((result) => {
        expect(result).toBeTruthy();
        expect(console.error).not.toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledTimes(1);
        expect(console.log).toHaveBeenCalledWith('Success !');

        expect(fs.readFileSync(outputFilePath, 'utf8')).toEqual(outputFileContent);
      })
    ));
  });

  describe('with watch', () => {
    it('creates the output file', () => (
      yamlToIntl('./tests/support/**/*.yml', {output: outputFilePath, watch: true}).then((result) => {
        expect(result).toBeTruthy();
        expect(console.error).not.toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledTimes(1);
        expect(console.log).toHaveBeenCalledWith('Success !');
        expect(fs.readFileSync(outputFilePath, 'utf8')).toEqual(outputFileContent);

        require('chokidar').emit();
      })
    ));
  });

  describe('errors', () => {
    describe('without input', () => {
      it('returns an error message', () => (
        yamlToIntl().catch((error) => {
          testErrors(error, 'Error ! Please specify an input directory.');
        })
      ));
    });

    describe('without options', () => {
      it('returns an error message', () => (
        yamlToIntl('./support/locales/**/*.yml').catch((error) => {
          testErrors(error, 'Error ! No options provided.');
        })
      ));
    });

    describe('without an output file', () => {
      it('returns an error message', () => (
        yamlToIntl('./support/locales/**/*.yml', {}).catch((error) => {
          testErrors(error, 'Error ! Please specify an output file.');
        })
      ));
    });

    describe('with an invalid output path', () => {
      it('returns an error message', () => (
        yamlToIntl('./tests/support/**/*.yml', {output: './invalid/path/locales.js'}).catch((error) => {
          testErrors(error, 'Error ! Could not create file ./invalid/path/locales.js.');
        })
      ));
    });
  });
});
