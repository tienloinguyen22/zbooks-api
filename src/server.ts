import { debug, mysqlConnection } from '@app/core';
import fs from 'fs';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import http from 'http';
import https from 'https';
import { bootstrapFirebase } from './firebase';
import { bootstrapModules } from './modules';
import { getApolloConfig } from './apollo';

(async (): Promise<void> => {
  // 1. Connect to MySql database
  mysqlConnection.connect(async (error) => {
    if (error) {
      // eslint-disable-next-line no-console
      console.log('Error connecting to MySql', error);
      process.exit();
    }

    // eslint-disable-next-line no-console
    console.log('Connect to MySql success');

    // 2. Initialize firebase admin
    bootstrapFirebase();

    // 3. Bootstrap apollo server
    const { typeDefs, resolvers } = await bootstrapModules();
    const apolloConfig = getApolloConfig({
      typeDefs,
      resolvers,
    });

    const server = new ApolloServer(apolloConfig);
    const app = express();
    server.applyMiddleware({
      app,
      path: '/graphql',
    });

    // Serving static files
    app.use('/static/images', express.static('uploads/images'));

    if (process.env.HTTPS === 'TRUE') {
      const key = fs.readFileSync(`${__dirname}/../selfsigned.key`);
      const cert = fs.readFileSync(`${__dirname}/../selfsigned.crt`);
      const httpsServer = https.createServer(
        {
          key,
          cert,
        },
        app,
      );
      const port = process.env.PORT || 444;
      httpsServer.listen(port);
      if (debug()) {
        global.console.log(`> Ready on https://localhost:${port}`);
        global.console.log(`Try your health check at: https://localhost:${port}/.well-known/apollo/server-health`);
      }
    } else {
      const httpServer = http.createServer(app);
      const port = process.env.PORT || 3001;
      httpServer.listen(port);
      if (debug()) {
        global.console.log(`> Ready on http://localhost:${port}`);
        global.console.log(`Try your health check at: https://localhost:${port}/.well-known/apollo/server-health`);
      }
    }
  });
})();
