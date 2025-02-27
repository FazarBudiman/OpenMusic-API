const PlaylistHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'Playlist',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const playlistHandler = new PlaylistHandler(service, validator);
    server.route(routes(playlistHandler));
  },
};
