import { ApolloServer } from 'apollo-server-lambda';
import { bootstrap } from './bootstrap';

const { apolloConfig } = bootstrap();
const handler = new ApolloServer(apolloConfig).createHandler({
  cors: {
    origin: '*',
    credentials: true,
  },
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
exports.handler = (event: any, context: any, callback: any) => {
  context.callbackWaitsForEmptyEventLoop = false;
  handler(event, context, callback);
};
