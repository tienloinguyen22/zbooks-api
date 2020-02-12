import { gql } from 'apollo-server-express';

export const baseTypeDefs = gql`
  type Query {
    _: String
  }

  type Mutation {
    _: String
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

  enum Genders {
    male
    female
    other
  }

  enum LoginTypes {
    facebook
    google
  }

  scalar Date
`;
