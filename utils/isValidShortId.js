const SHORT_ID_REGEX = /^[a-zA-Z0-9_-]{10}$/;

const isValidShortId = (value) =>
  typeof value === 'string' && SHORT_ID_REGEX.test(value);

module.exports = isValidShortId;
