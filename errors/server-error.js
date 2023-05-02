const { ERROR_CODES } = require('../utils/constants');

class ServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODES.SERVER_ERROR;
  }
}

module.exports = ServerError;
