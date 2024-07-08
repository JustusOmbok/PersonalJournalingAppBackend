require('reflect-metadata');
const { createConnection } = require('typeorm');
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const entryRoutes = require('./routes/entry');

createConnection().then(() => {
  const app = express();
  const port = 3000;

  app.use(bodyParser.json());
  app.use('/api/auth', userRoutes);
  app.use('/api/entries', entryRoutes);

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}).catch(error => console.log(error));
