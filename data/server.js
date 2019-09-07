const express = require('express');

const server = express();

server.use(express.json());

const actionRouter = require('./Router/actionRouter.js');
server.use('/api/action', actionRouter);

const projectRouter = require('./Router/projectRouter.js');
server.use('/api/project', projectRouter);

server.get('/', (req, res) => {
  res.send(`<h2>It's working! It's working!!</h2>`);
});

module.exports = server;
