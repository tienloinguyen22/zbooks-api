import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  extend type Query {
    categories: QueryCategoriesOperations
  }

  type QueryCategoriesOperations {
    findById(id: ID!): Category
    find(payload: FindCategoriesQuery!): CategoryQueryResult
  }

  type Category {
    id: ID!
    name: String!
    slug: String!
    imageUrl: String!
    createdAt: String
    updatedAt: String
  }

  input FindCategoriesQuery {
    filter_textSearch: String
    orderBy: String
    pageIndex: Int
    itemsPerPage: Int
  }

  type CategoryQueryResult {
    data: [Category]
    pagination: OffsetPaginationResult
  }

  extend type Mutation {
    categories: CategoryOperations
  }

  type CategoryOperations {
    seedCategories(payload: SeedCategoriesPayload): [Category]
  }

  input SeedCategoriesPayload {
    numberOfCategories: Int
  }
`;
