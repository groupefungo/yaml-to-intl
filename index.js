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
      const locale = Object.keys(locales)[0];

      console.log(flatten(locales[locale]));
    });
  });
};
