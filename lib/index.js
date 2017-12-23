function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var chokidar = require('chokidar');

var merge = require('deepmerge');

var fs = require('fs');

var glob = require('glob');

var yaml = require('js-yaml');

var flatten = function flatten(locales) {
  var data = {};

  var _arr = Object.keys(locales);

  for (var _i = 0; _i < _arr.length; _i++) {
    var key = _arr[_i];
    var value = locales[key];

    if (_typeof(value) === 'object') {
      var _arr2 = Object.keys(flatten(value));

      for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
        var childKey = _arr2[_i2];
        var newValue = value;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = childKey.split(/\./)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _childKeyPart = _step.value;
            newValue = newValue[_childKeyPart];
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        data["".concat(key, ".").concat(childKey)] = newValue;
      }

      ;
    } else {
      data[key] = value;
    }
  }

  ;
  return data;
};

var createFile = function createFile(input, options) {
  return new Promise(function (resolve, reject) {
    var output = options.output;
    var locales = {};
    glob(input, function (err, files) {
      if (err) {
        var error = 'Error ! Invalid input path.';
        console.error(error);
        return reject(error);
      }

      ;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = files[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _file = _step2.value;
          var yamlJson = yaml.safeLoad(fs.readFileSync(_file, 'utf8'), {
            json: true
          });
          var locale = Object.keys(yamlJson)[0];
          var flattenedLocales = flatten(yamlJson[locale]);
          locales = merge(locales, _defineProperty({}, locale, flattenedLocales));
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      ;
      fs.writeFile(output, "export default ".concat(JSON.stringify(locales)), function (err) {
        if (err) {
          var _error = "Error ! Could not create file ".concat(output, ".");

          console.error(_error);
          return reject(_error);
        }

        ;
        var successMessage = 'Success !';
        console.log(successMessage);
        return resolve(successMessage);
      });
    });
  });
};

module.exports = function (input, options) {
  return new Promise(function (resolve, reject) {
    if (!input) {
      var error = 'Error ! Please specify an input directory.';
      console.error(error);
      return reject(error);
    }

    if (!options) {
      var _error2 = 'Error ! No options provided.';
      console.error(_error2);
      return reject(_error2);
    }

    var output = options.output,
        watch = options.watch;

    if (!output) {
      var _error3 = 'Error ! Please specify an output file.';
      console.error(_error3);
      return reject(_error3);
    }

    createFile(input, options).then(function (result) {
      resolve(result);
    }).catch(function (error) {
      reject(error);
    });

    if (watch) {
      var watcher = chokidar.watch(input);
      watcher.on('change', function () {
        createFile(input, options);
      });
    }
  });
};