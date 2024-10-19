const AnotherError = require('../../exceptions/AnotherError');
const ExportPlaylistSchema = require('./schema');

const ExportPlaylistValidator = {
  validateExportsPlaylistPayload: (payload) => {
    const validation = ExportPlaylistSchema.validate(payload);
    if (validation.error) {
      throw new AnotherError(validation.error.message);
    }
  },
};

module.exports = ExportPlaylistValidator;
