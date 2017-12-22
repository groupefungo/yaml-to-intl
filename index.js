const chokidar = require('chokidar');
const merge = require('deepmerge');
const fs = require('fs');
const glob = require('glob');
const yaml = require('js-yaml');

const flatten = (locales) => {
  const data = {};

  for (let key of Object.keys(locales)) {
    const value = locales[key];

    if (typeof value === 'object') {
      for (let childKey of Object.keys(flatten(value))) {
        const childKeyParts = childKey.split(/\./);
        let newValue = value;

        for (let childKeyPart of childKeyParts) {
          newValue = newValue[childKeyPart];
        }

        data[`${key}.${childKey}`] = newValue;
      };
    } else {
      data[key] = value;
    }
  };

  return data;
};

const createFile = (input, options) => {
  const {output} = options;
  let locales = {};

  glob(input, {}, (err, files) => {
    if (err) {
      console.log(err);

      return false;
    };

    for (let file of files) {
      const yamlJson = yaml.safeLoad(fs.readFileSync(file, 'utf8'), {json: true});
      const locale = Object.keys(yamlJson)[0];
      const flattenedLocales = flatten(yamlJson[locale]);

      locales = merge(locales, {[locale]: flattenedLocales});
    };

    fs.writeFile(output, `export default ${JSON.stringify(locales)}`, (err) => {
      if (err) {
        console.log('Error ! Could not create file.', '\n', err);

        return false;
      };

      console.log('Success !');

      return true;
    });
  });
};

module.exports = (input, options) => {
  const {output, watch} = options;

  if (!input) {
    console.log('Error ! Please specify an input directory.');

    return false;
  }

  if (!output) {
    console.log('Error ! Please specify an output file.');

    return false;
  }

  createFile(input, options);

  if (watch) {
    const watcher = chokidar.watch(input);

    watcher.on('all', () => {
      createFile(input, options);
    });
  }

  return true;
};
