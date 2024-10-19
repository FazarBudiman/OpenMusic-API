const AnotherError = require('../../exceptions/AnotherError');
const { postAuthenticationPayloadSchema, putAuthenticationPayloadSchema, deleteAuthenticationPayloadSchema } = require('./schema');

const AuthenticationsValidator = {
  validatePostAuthenticationPayload: (payload) => {
    const validation = postAuthenticationPayloadSchema.validate(payload);
    if (validation.error) {
      throw new AnotherError(validation.error.message);
    }
  },

  validatePutAuthenticationPayload: (payload) => {
    const validation = putAuthenticationPayloadSchema.validate(payload);
    if (validation.error) {
      throw new AnotherError(validation.error.message);
    }
  },

  validateDeleteAuthenticationPayload: (payload) => {
    const validation = deleteAuthenticationPayloadSchema.validate(payload);
    if (validation.error) {
      throw new AnotherError(validation.error.message);
    }
  },
};

module.exports = AuthenticationsValidator;
