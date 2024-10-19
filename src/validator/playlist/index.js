const AnotherError = require('../../exceptions/AnotherError');
const { postPlaylistPayloadSchema, postDeleteSongInPlaylistPayloadSchema } = require('./schema');

const PlaylistsValidator = {
  validatePostPlaylistPayload: (payload) => {
    const validation = postPlaylistPayloadSchema.validate(payload);
    if (validation.error) {
      throw new AnotherError(validation.error.message);
    }
  },

  validatePostDeleteSonginPlaylistPayload: (payload) => {
    const validation = postDeleteSongInPlaylistPayloadSchema.validate(payload);
    if (validation.error) {
      throw new AnotherError(validation.error.message);
    }
  },
};

module.exports = PlaylistsValidator;
