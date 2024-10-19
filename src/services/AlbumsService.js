const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const NotFoundError = require('../exceptions/NotFoundError');
const AnotherError = require('../exceptions/AnotherError');
const { mapDBToModelAlbums } = require('../utils');

class AlbumsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addAlbum({ name, year }) {
    const id = nanoid(16);
    const query = `INSERT INTO albums VALUES ('album-${id}', '${name}', ${year}) RETURNING id`;
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new AnotherError('Gagal menambahkan album');
    }
    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const query = `SELECT * FROM albums WHERE id = '${id}'`;
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal menemukan Album');
    }
    return result.rows.map(mapDBToModelAlbums)[0];
  }

  async getSongInAlbumById(id) {
    const query = `SELECT songs.id, title, performer from songs LEFT JOIN albums on songs.album_id = albums.id WHERE albums.id = '${id}'`;
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      return null;
    }
    return result.rows;
  }

  async editAlbumById(id, { name, year }) {
    const query = `UPDATE albums SET name = '${name}', year = ${year} WHERE id = '${id}' RETURNING id`;
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. ID tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = `DELETE FROM albums WHERE id = '${id}' RETURNING id`;
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus album. ID tidak ditemukan');
    }
  }

  async likeAlbum({ albumsId, credentialId }) {
    const id = nanoid(16);
    const query = `INSERT INTO user_album_likes VALUES ('${id}','${credentialId}','${albumsId}') RETURNING id`;
    const result = await this._pool.query(query);
    await this._cacheService.delete(`sumOfLike:${albumsId}`);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal menyukai album. ID tidak ditemukan');
    }
  }

  async unlikeAlbum({ albumsId, credentialId }) {
    const query = `DELETE FROM user_album_likes WHERE album_id = '${albumsId}' AND user_id = '${credentialId}' RETURNING id`;
    const result = await this._pool.query(query);
    await this._cacheService.delete(`sumOfLike:${albumsId}`);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal menyukai album. ID tidak ditemukan');
    }
  }

  async getSumOfLikeAlbum(albumsId) {
    let sumLike;
    sumLike = await this._cacheService.get(`sumOfLike:${albumsId}`);
    let isCache = true;
    if (sumLike === null) {
      const query = `SELECT COUNT(*) FROM user_album_likes WHERE album_id = '${albumsId}'`;
      const result = await this._pool.query(query);
      const { count } = result.rows[0];
      sumLike = count;
      isCache = false;
      await this._cacheService.set(`sumOfLike:${albumsId}`, sumLike);
      if (!result.rows.length) {
        throw new NotFoundError('Gagal mendapatkan suka pada album. ID tidak ditemukan');
      }
    }
    return {
      sumLike,
      isCache,
    };
  }

  async checkLikeInAlbum({ albumsId, credentialId }) {
    const query = `SELECT * FROM user_album_likes WHERE album_id = '${albumsId}' AND user_id = '${credentialId}'`;
    const result = await this._pool.query(query);
    if (result.rowCount !== 0) {
      throw new AnotherError('Album sudah disukai');
    }
  }
}

module.exports = AlbumsService;
