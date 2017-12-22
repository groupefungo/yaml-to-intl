const fs = require('fs');
const glob = require('glob');
const yaml = require('js-yaml');

const flatten = (locales) {
  const data = {};

  Object.keys(locales).forEach((key) => {
    const value = locales[key];

    if (typeof value === 'object') {
      Object.keys(flatten(value)).forEach((childKey) => {
        data[`${key}.${childKey}`] = value[childKey];
      });
    } else {
      data[key] = value;
    }
  });

  return data;
};

module.exports = (input, options) => {
  if (!input) {
    console.log('Error ! Please specify an input directory.');

    return false;
  }

  const {output, watch} = options;

  if (!output) {
    console.log('Error ! Please specify an output file.');

    return false;
  }

  glob(input, {}, (err, files) => {
    if (err) {
      console.log(err);
    };

    files.forEach((file) => {
      const locales = yaml.safeLoad(fs.readFileSync(file, 'utf8'), {json: true});

      console.log(flatten(locales));
    });
  });
};
