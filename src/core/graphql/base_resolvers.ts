import { GraphQLScalarType, Kind } from 'graphql';

export const baseResolvers = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    serialize: (value: Date) => {
      // value sent to the client
      return value.toISOString();
    },
    parseValue: (value: string) => {
      // value from the client
      return new Date(value).toISOString();
    },
    parseLiteral: (ast) => {
      switch (ast.kind) {
        case Kind.INT:
          return 1;
        default:
          // eslint-disable-next-line no-null/no-null
          return null;
      }
    },
  }),
};
