const AnotherError = require('../../exceptions/AnotherError');
const { AlbumPayloadSchema, CoverImageHeaderSchema } = require('./schema');

const AlbumsValidator = {
  validateAlbumsPayload: (payload) => {
    const validation = AlbumPayloadSchema.validate(payload);
    if (validation.error) {
      throw new AnotherError(validation.error.message);
    }
  },

  validateCoverImageHeader: (headers) => {
    const validation = CoverImageHeaderSchema.validate(headers);

    if (validation.error) {
      throw new AnotherError(validation.error.message);
    }
  },
};

module.exports = AlbumsValidator;
