import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  extend type Query {
    provinces: QueryProvincesOperations
  }

  type QueryProvincesOperations {
    findById(id: ID!): Province
    find(payload: FindProvincesQuery!): ProvinceQueryResult
  }

  type Province {
    id: ID!
    name: String!
    slug: String!
    totalPosts: Int!
    createdAt: String
    updatedAt: String
  }

  input FindProvincesQuery {
    filter_textSearch: String
    orderBy: String
    pageIndex: Int
    itemsPerPage: Int
  }

  type ProvinceQueryResult {
    data: [Province]
    pagination: OffsetPaginationResult
  }

  extend type Mutation {
    provinces: ProvinceOperations
  }

  type ProvinceOperations {
    seedProvinces(payload: SeedProvincesPayload): [Province]
  }

  input SeedProvincesPayload {
    numberOfProvinces: Int
  }
`;
