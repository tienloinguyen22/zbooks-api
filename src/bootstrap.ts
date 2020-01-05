import mongoose from 'mongoose';
import { config } from '@app/config';
import { debug } from '@app/core';
import { bootstrapModules } from './modules';
import { getApolloConfig } from './apollo';
import { bootstrapFirebase } from './firebase';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const bootstrap = (): { apolloConfig: Record<string, any> } => {
  mongoose.connect(config.mongoConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: debug(),
  });
  if (debug()) {
    mongoose.set('debug', true);
  }

  bootstrapFirebase();

  const { typeDefs, resolvers } = bootstrapModules();
  const apolloConfig = getApolloConfig({
    typeDefs,
    resolvers,
  });
  return {
    apolloConfig,
  };
};
