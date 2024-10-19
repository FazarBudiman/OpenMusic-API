const AnotherError = require('../../exceptions/AnotherError');
const userPayloadSchema = require('./schema');

const UsersValidator = {
  validateUsersPayload: (payload) => {
    const validation = userPayloadSchema.validate(payload);
    if (validation.error) {
      throw new AnotherError(validation.error.message);
    }
  },
};

module.exports = UsersValidator;
