import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  extend type Query {
    shops: QueryShopsOperations
  }

  type QueryShopsOperations {
    findById(id: ID!): Shop
    find(payload: FindShopsQuery!): ShopQueryResult
  }

  type Shop {
    id: ID!
    name: String!
    domain: String
    ownerId: String
    address: String
    longtitude: String
    latitude: String
    description: String
    phoneNo: String
    email: String
    logoUrl: String
    isActive: String
    createdAt: String
    updatedAt: String
  }

  input FindShopsQuery {
    filter_textSearch: String
    isActive_equals: Boolean
    orderBy: String
    pageIndex: Int
    itemsPerPage: Int
  }

  type ShopQueryResult {
    data: [Shop]
    pagination: OffsetPaginationResult
  }

  extend type Mutation {
    shops: ShopOperations
  }

  type ShopOperations {
    seedShops(payload: SeedShopsPayload): [Shop]
  }

  input SeedShopsPayload {
    numberOfShops: Int
  }
`;
