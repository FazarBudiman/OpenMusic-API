const AnotherError = require('../../exceptions/AnotherError');
const SongPayloadSchema = require('./schema');

const SongsValidator = {
  validateSongsPayload: (payload) => {
    const validation = SongPayloadSchema.validate(payload);
    if (validation.error) {
      throw new AnotherError(validation.error.message);
    }
  },
};

module.exports = SongsValidator;
