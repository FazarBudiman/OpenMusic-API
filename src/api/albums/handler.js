/* eslint-disable import/no-extraneous-dependencies */
const autoBind = require('auto-bind');

class AlbumsHandler {
  constructor(albumsService, storageService, validator) {
    this._albumsService = albumsService;
    this._storageService = storageService;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumsPayload(request.payload);

    const { name, year } = request.payload;

    const albumId = await this._albumsService.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;
    const album = await this._albumsService.getAlbumById(id);
    const songs = await this._albumsService.getSongInAlbumById(id);

    const response = h.response({
      status: 'success',
      data: {
        album: { ...album, songs },
      },
    });
    response.code(200);
    return response;
  }

  async putAlbumByIdHandler(request) {
    this._validator.validateAlbumsPayload(request.payload);

    const { id } = request.params;

    await this._albumsService.editAlbumById(id, request.payload);

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;

    await this._albumsService.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }

  async likeAlbumByIdHandler(request, h) {
    const { id: albumsId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._albumsService.getAlbumById(albumsId);
    await this._albumsService.checkLikeInAlbum({ albumsId, credentialId });
    await this._albumsService.likeAlbum({ albumsId, credentialId });
    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan suka',
    });
    response.code(201);
    return response;
  }

  async unlikeAlbumByIdHandler(request) {
    const { id: albumsId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._albumsService.getAlbumById(albumsId);
    await this._albumsService.unlikeAlbum({ albumsId, credentialId });

    return {
      status: 'success',
      message: 'Album berhasil dihapus suka',
    };
  }

  async getSumOfLikeOnAlbumByIdHandler(request, h) {
    const { id: albumsId } = request.params;

    const { sumLike, isCache } = await this._albumsService.getSumOfLikeAlbum(albumsId);

    const response = h.response({
      status: 'success',
      data: {
        likes: Number(sumLike),
      },
    });
    if (isCache) {
      response.header('X-Data-Source', 'cache');
    } else {
      response.header('X-Data-Source', 'not-cache');
    }

    return response;
  }

  async postUploadCoverImageHandler(request, h) {
    const { cover } = request.payload;
    const { albumsId } = request.params;

    this._validator.validateCoverImageHeader(cover.hapi.headers);

    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/albums/images/${filename}`;

    await this._storageService.updateAlbumsTable(fileLocation, albumsId);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }
}

module.exports = AlbumsHandler;
