import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  extend type Query {
    favorite_books: QueryFavoriteBooksOperations
  }

  type QueryFavoriteBooksOperations {
    findByBook(payload: FindByBookQuery!): FavoriteBook
  }

  type FavoriteBook {
    id: ID!
    user: String!
    book: String!
    createdBy: String
    createdAt: String
    lastModifiedBy: String
    lastModifiedAt: String
  }

  input FindByBookQuery {
    book: String!
  }

  extend type Mutation {
    favorite_books: FavoriteBooksOperations
  }

  type FavoriteBooksOperations {
    create(payload: FindByBookQuery!): FavoriteBook
    delete(payload: FindByBookQuery!): Boolean
  }
`;
