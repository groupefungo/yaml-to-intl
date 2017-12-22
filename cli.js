#!/usr/bin/env node
const meow = require('meow');
const yamlToIntl = require('.');

const cli = meow(`
  Usage
	  $ yaml-to-intl <input dir> --output './path/to/output/file.js'

	Options
	  --output,  -o   The output file
	  --watch,   -w   Watch the input dir for changes
`, {
  flags: {
    output: {
      type: 'string',
      alias: 'o',
    },
    watch: {
      type: 'boolean',
      alias: 'w',
      default: false,
    },
  },
});

yamlToIntl(cli.input[0], cli.flags);
