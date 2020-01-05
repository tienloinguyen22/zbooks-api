import { gql } from 'apollo-server-express';

export const baseTypeDefs = gql`
  type Query {
    _: String
  }

  type Mutation {
    _: String
  }

  type CommandResult {
    id: ID!
  }

  type OffsetPaginationResult {
    type: String!
    total: Int!
  }

  type CursorPaginationResult {
    type: String!
    prevCursor: String
    nextCursor: String
  }
`;
