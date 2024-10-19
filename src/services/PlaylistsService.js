const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const AnotherError = require('../exceptions/AnotherError');
const NotFoundError = require('../exceptions/NotFoundError');
const AuthorizationError = require('../exceptions/AuthorizationError');

class PlaylistsService {
  constructor(collaborationService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;
  }

  async addPlaylist({ name, owner }) {
    const id = nanoid(16);
    const query = `INSERT INTO playlists VALUES('playlist-${id}', '${name}', '${owner}') RETURNING id`;
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new AnotherError('Playlist gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getAllPlaylist(owner) {
    const query = `SELECT p.id, p.name, u.username FROM playlists p LEFT JOIN users u ON p.owner = u.id  WHERE owner = '${owner}'`;
    const result = await this._pool.query(query);
    return result.rows;
  }

  async verifyPlaylist(id) {
    const query = `SELECT * FROM playlists WHERE id = '${id}'`;
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = `SELECT * FROM playlists WHERE id = '${id}' AND owner = '${owner}'`;
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new AuthorizationError('Anda tidak berhak menghapus resource ini');
    }
  }

  async deletePlaylistById(id) {
    const query = `DELETE FROM playlists WHERE id = '${id}' RETURNING id`;
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus playlist. ID tidak ditemukan');
    }
  }

  async verifySong(songId) {
    const query = `SELECT * FROM songs WHERE id = '${songId}'`;
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
  }

  async addSongInPlaylist(songId, playlistId) {
    const id = nanoid(16);
    const query = `INSERT INTO playlist_songs VALUES('playlist_song-${id}', '${playlistId}', '${songId}') RETURNING id`;
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new AnotherError('Lagu gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getPlaylistById(owner, playlistId) {
    const query = `SELECT p.id, p.name, u.username FROM playlists p LEFT JOIN users u ON p.owner = u.id  WHERE owner = '${owner}' AND p.id = '${playlistId}'`;
    const result = await this._pool.query(query);
    return result.rows;
  }

  async getSongsInPlaylist(playlistId) {
    const query = `select s.id, s.title, s.performer from playlist_songs ps left join songs s on ps.song_id = s.id where ps.playlist_id ='${playlistId}'`;
    const result = await this._pool.query(query);
    return result.rows;
  }

  async deleteSongInPlaylist(songId, playlistId) {
    const query = `DELETE FROM playlist_songs WHERE playlist_id = '${playlistId}' AND song_id = '${songId}' RETURNING id`;
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus lagu dalam playlist. ID tidak ditemukan');
    }
  }
}

module.exports = PlaylistsService;
