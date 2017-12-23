#!/usr/bin/env node
var meow = require('meow');

var yamlToIntl = require('.');

var cli = meow("\n  Usage\n\t  $ yaml-to-intl <input dir> --output './path/to/output/file.js'\n\n\tOptions\n\t  --output,  -o   The output file\n\t  --watch,   -w   Watch the input dir for changes\n", {
  flags: {
    output: {
      type: 'string',
      alias: 'o'
    },
    watch: {
      type: 'boolean',
      alias: 'w',
      default: false
    }
  }
});
yamlToIntl(cli.input[0], cli.flags);