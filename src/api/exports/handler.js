const autoBind = require('auto-bind');

class ExportsHandler {
  constructor(producersService, playlistsService, validator) {
    this._producersService = producersService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    autoBind(this);
  }

  async postExportsPlaylistHandler(request, h) {
    await this._validator.validateExportsPlaylistPayload(request.payload);

    const message = {
      userId: request.auth.credentials.id,
      targetEmail: request.payload.targetEmail,
    };

    const { playlistId } = request.params;

    await this._playlistsService.verifyPlaylist(playlistId);
    await this._playlistsService.verifyPlaylistOwner(playlistId, message.userId);
    await this._producersService.sendMessage('export:playlist', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
