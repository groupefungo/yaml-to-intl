const fs = require('fs');
const glob = require('glob');
const yaml = require('js-yaml');
const merge = require('deepmerge');

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

module.exports = (input, options) => {
  const {output, watch} = options;
  let locales = {};

  if (!input) {
    console.log('Error ! Please specify an input directory.');

    return false;
  }

  if (!output) {
    console.log('Error ! Please specify an output file.');

    return false;
  }

  glob(input, {}, (err, files) => {
    if (err) {
      console.log(err);
    };

    files.forEach((file) => {
      const yamlJson = yaml.safeLoad(fs.readFileSync(file, 'utf8'), {json: true});
      const locale = Object.keys(yamlJson)[0];
      const flattenedLocales = flatten(yamlJson[locale]);

      locales = merge(locales, {[locale]: flattenedLocales});
    });
  });

  console.log(locales);
};
