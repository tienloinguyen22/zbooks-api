import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type ShopImage {
    id: ID!
    imageUrl: String!
    shopId: String!
    createdAt: String
    updatedAt: String
  }

  extend type Mutation {
    shopImages: ShopImageOperations
  }

  type ShopImageOperations {
    seedShopImages(payload: SeedShopImagesPayload): [ShopImage]
  }

  input SeedShopImagesPayload {
    numberOfImages: Int
  }
`;
