const { ERROR_CODES } = require('../utils/constants');

class ConflictCode extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODES.CONFLICT_CODE;
  }
}

module.exports = ConflictCode;
