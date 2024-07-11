import 'reflect-metadata';
import { createConnection } from 'typeorm';
import express from 'express';
import { json } from 'body-parser';
import userRoutes from './routes/user';
import entryRoutes from './routes/entry';

const createApp = () => {
  const app = express();
  app.use(json());
  app.use('/api/auth', userRoutes);
  app.use('/api/entries', entryRoutes);
  return app;
};

const startServer = async () => {
  try {
    await createConnection();
    const app = createApp();
    const port = 3000;
    const server = app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
    return server;
  } catch (error) {
    console.log(error);
  }
};

if (require.main === module) {
  startServer();
}

export default { createApp, startServer };
