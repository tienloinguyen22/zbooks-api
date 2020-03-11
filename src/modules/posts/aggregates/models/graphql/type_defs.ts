import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  extend type Query {
    models: QueryModelsOperations
  }

  type QueryModelsOperations {
    findById(id: ID!): Model
    find(payload: FindModelsQuery!): ModelQueryResult
  }

  type Model {
    id: ID!
    name: String!
    slug: String!
    brandId: String!
    categoryId: String!
    createdAt: String
    updatedAt: String
  }

  input FindModelsQuery {
    filter_textSearch: String
    orderBy: String
    pageIndex: Int
    itemsPerPage: Int
  }

  type ModelQueryResult {
    data: [Model]
    pagination: OffsetPaginationResult
  }

  extend type Mutation {
    models: ModelOperations
  }

  type ModelOperations {
    seedModels(payload: SeedModelsPayload): [Model]
  }

  input SeedModelsPayload {
    numberOfModels: Int
  }
`;
