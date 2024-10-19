const Joi = require('joi');

const postPlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

const postDeleteSongInPlaylistPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = {
  postPlaylistPayloadSchema,
  postDeleteSongInPlaylistPayloadSchema,
};
