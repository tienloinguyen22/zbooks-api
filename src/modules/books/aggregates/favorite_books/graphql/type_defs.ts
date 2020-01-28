import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  extend type Query {
    favorite_books: QueryFavoriteBooksOperations
  }

  type QueryFavoriteBooksOperations {
    find(payload: FindFavoriteBooksQuery!): FavoriteBookQueryResult
    findByBook(payload: FindByBookQuery!): FavoriteBook
  }

  type FavoriteBook {
    id: ID!
    user: User!
    book: Book!
    createdBy: String
    createdAt: String
    lastModifiedBy: String
    lastModifiedAt: String
  }

  type FavoriteBookQueryResult {
    data: [FavoriteBook!]
    pagination: OffsetPaginationResult
  }

  input FindFavoriteBooksQuery {
    orderBy: String
    pageIndex: Int
    itemsPerPage: Int
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
