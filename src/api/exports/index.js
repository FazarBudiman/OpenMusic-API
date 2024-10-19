const ExportsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'export',
  version: '1.0.0',
  register: async (server, { producersService, playlistsService, validator }) => {
    const exportsHandler = new ExportsHandler(producersService, playlistsService, validator);
    server.route(routes(exportsHandler));
  },
};
