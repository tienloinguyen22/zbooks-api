import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  extend type Query {
    brands: QueryBrandsOperations
  }

  type QueryBrandsOperations {
    findById(id: ID!): Brand
    find(payload: FindBrandsQuery!): BrandQueryResult
  }

  type Brand {
    id: ID!
    name: String!
    slug: String!
    imageUrl: String!
    createdAt: String
    updatedAt: String
  }

  input FindBrandsQuery {
    filter_textSearch: String
    orderBy: String
    pageIndex: Int
    itemsPerPage: Int
  }

  type BrandQueryResult {
    data: [Brand]
    pagination: OffsetPaginationResult
  }

  extend type Mutation {
    brands: BrandOperations
  }

  type BrandOperations {
    seedBrands(payload: SeedBrandsPayload): [Brand]
  }

  input SeedBrandsPayload {
    numberOfBrands: Int
  }
`;
