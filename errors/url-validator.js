const validator = require('validator');
const ErrorCode = require('./error-code');

const urlValidator = (link) => {
  if (!validator.isURL(link)) {
    throw new ErrorCode('Ссылка не валидна');
  }
  return link;
};

module.exports = { urlValidator };
