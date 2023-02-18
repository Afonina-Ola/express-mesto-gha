const ERROR_CODES = require('../utils/constants');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODES.SERVER_ERROR;
  }
}

module.exports = UnauthorizedError;
