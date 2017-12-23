let callback = null;

const chokidar = jest.genMockFromModule('chokidar');

chokidar.watch = jest.fn(input => ({
  on: (input, cb) => callback = cb,
}));

chokidar.emit = () => callback();

module.exports = chokidar;
