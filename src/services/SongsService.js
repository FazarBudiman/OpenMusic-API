const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const AnotherError = require('../exceptions/AnotherError');
const NotFoundError = require('../exceptions/NotFoundError');
const { mapDBToModelSongs } = require('../utils');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title, year, genre, performer, duration, albumId,
  }) {
    const id = nanoid(16);
    const query = albumId === undefined ? `INSERT INTO songs (id, title, year, genre, performer, duration) VALUES ('song-${id}', '${title}', ${year}, '${genre}', '${performer}', ${duration}) RETURNING id` : `INSERT INTO songs VALUES ('song-${id}', '${title}', ${year}, '${genre}', '${performer}', ${duration}, '${albumId}') RETURNING id`;
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new AnotherError('Gagal menambahkan Lagu');
    }
    return result.rows[0].id;
  }

  async getAllSong({ title, performer }) {
    let query;
    if (title && performer) {
      query = `SELECT id, title, performer FROM songs WHERE LOWER(title) LIKE '%${title}%' AND LOWER(performer) LIKE '%${performer}%'`;
    } else if (title || performer) {
      query = `SELECT id, title, performer FROM songs WHERE LOWER(title) LIKE '%${title}%' OR LOWER(performer) LIKE '%${performer}%'`;
    } else {
      query = 'SELECT id, title, performer FROM songs';
    }
    const result = await this._pool.query(query);
    return result.rows;
  }

  async getSongById(id) {
    const query = `SELECT * FROM songs WHERE id = '${id}'`;
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal menemukan lagu');
    }
    return result.rows.map(mapDBToModelSongs)[0];
  }

  async editSongById(id, {
    title, year, genre, performer, duration, albumId,
  }) {
    const query = albumId === undefined ? `UPDATE songs SET title = '${title}', year = ${year}, genre = '${genre}', performer = '${performer}', duration = ${duration} WHERE id = '${id}' RETURNING id` : `UPDATE songs SET title = '${title}', year = ${year}, genre = '${genre}', performer = '${performer}', duration = ${duration}, album_id = '${albumId}' WHERE id = '${id}' RETURNING id`;
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui lagu. ID tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = `DELETE FROM songs WHERE id = '${id}' RETURNING id`;
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus lagu. ID tidak ditemukan');
    }
  }
}

module.exports = SongsService;
