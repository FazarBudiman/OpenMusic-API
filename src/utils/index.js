/* eslint-disable camelcase */
const mapDBToModelSongs = (
  {
    id,
    title,
    year,
    genre,
    performer,
    duration,
    album_id,
  },
) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId: album_id,
});

const mapDBToModelAlbums = (
  {
    id,
    name,
    year,
    cover,
  },
) => ({
  id,
  name,
  year,
  coverUrl: cover,
});

module.exports = { mapDBToModelSongs, mapDBToModelAlbums };
