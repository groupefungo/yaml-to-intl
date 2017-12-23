const fs = require('fs');

module.exports = {
  testErrors: (error, errorMessage) => {
    expect(error).toEqual(errorMessage);
    expect(console.error).toHaveBeenCalledWith(errorMessage);
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.log).not.toHaveBeenCalled();
  },
  unlinkGeneratedFiles: (filePath) => {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath);
    }
  },
};
