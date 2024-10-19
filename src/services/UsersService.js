/* eslint-disable import/no-extraneous-dependencies */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const AnotherError = require('../exceptions/AnotherError');
const AuthenticationError = require('../exceptions/AuthenticationError');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async usernameCheck(username) {
    const query = `SELECT username FROM users WHERE username = '${username}'`;
    const result = await this._pool.query(query);
    if (result.rows.length > 0) {
      throw new AnotherError('Gagal menambagkan username. Username sudah digunakan');
    }
  }

  async addUser({ username, password, fullname }) {
    await this.usernameCheck(username);
    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO users VALUES('${id}','${username}', '${hashedPassword}','${fullname}') RETURNING id`;
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new AnotherError('user gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async verifyUserCredential(username, password) {
    const query = `SELECT id, password FROM users WHERE username = '${username}' `;
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new AuthenticationError('Kredensial yang anda berikan salah');
    }
    const { id, password: hashPassword } = result.rows[0];
    const match = await bcrypt.compare(password, hashPassword);
    if (!match) {
      throw new AuthenticationError('Kredensial yang anda berikan salah');
    }
    return id;
  }
}

module.exports = UsersService;
