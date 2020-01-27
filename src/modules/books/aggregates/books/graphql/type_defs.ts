import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  extend type Query {
    books: QueryBooksOperations
  }

  type QueryBooksOperations {
    findById(id: ID!): Book
    find(payload: FindBooksQuery!): BookQueryResult
  }

  type Book {
    id: ID!
    title: String!
    author: String!
    description: String!
    category: [String!]
    year: String
    publisher: String
    language: String
    pages: String
    fileInfo: String
    downloadUrl: String
    referer: String
    coverUrl: String
    downloadCount: Int
  }

  input FindBooksQuery {
    filter_textSearch: String
    category_in: [String!]
    orderBy: String
    pageIndex: Int
    itemsPerPage: Int
  }

  type BookQueryResult {
    data: [Book!]
    pagination: OffsetPaginationResult
  }
`;
