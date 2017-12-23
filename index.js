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
        let newValue = value;

        for (let childKeyPart of childKey.split(/\./)) {
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
  return new Promise((resolve, reject) => {
    const {output} = options;
    let locales = {};

    glob(input, (err, files) => {
      if (err) {
        const error = 'Error ! Invalid input path.';

        console.error(error);

        return reject(error);
      };

      for (let file of files) {
        const yamlJson = yaml.safeLoad(fs.readFileSync(file, 'utf8'), {json: true});
        const locale = Object.keys(yamlJson)[0];
        const flattenedLocales = flatten(yamlJson[locale]);

        locales = merge(locales, {[locale]: flattenedLocales});
      };

      fs.writeFile(output, `export default ${JSON.stringify(locales)}`, (err) => {
        if (err) {
          const error = `Error ! Could not create file ${output}.`;

          console.error(error);

          return reject(error);
        };

        const successMessage = 'Success !';

        console.log(successMessage);

        return resolve(successMessage);
      });
    });
  });
};

module.exports = (input, options) => {
  return new Promise((resolve, reject) => {
    if (!input) {
      const error = 'Error ! Please specify an input directory.';

      console.error(error);

      return reject(error);
    }

    if (!options) {
      const error = 'Error ! No options provided.';

      console.error(error);

      return reject(error);
    }

    const {output, watch} = options;

    if (!output) {
      const error = 'Error ! Please specify an output file.';

      console.error(error);

      return reject(error);
    }

    createFile(input, options).then((result) => {
      resolve(result);
    }).catch((error) => {
      reject(error);
    });

    if (watch) {
      const watcher = chokidar.watch(input);

      watcher.on('change', () => {
        createFile(input, options);
      });
    }
  });
};
