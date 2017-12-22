module.exports = (input, options) => {
  if (!input) {
    console.log('Error ! Please specify an input directory.');

    return false;
  }

  const {output} = options;

  if (!output) {
    console.log('Error ! Please specify an output file.');

    return false;
  }
};
