const ClientError = require('./ClientError');

class AnotherError extends ClientError {
  constructor(message) {
    super(message);
    this.name = 'AnotherError';
  }
}

module.exports = AnotherError;
