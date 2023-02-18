const ERROR_CODES = require('../utils/constants');

class NotFounError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODES.NOT_FOUND_ERROR;
  }
}

module.exports = NotFounError;
