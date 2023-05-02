const { ERROR_CODES } = require('../utils/constants');

class ErrorCode extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODES.ERROR_CODE;
  }
}

module.exports = ErrorCode;
