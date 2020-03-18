import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type PostImage {
    id: ID!
    imageUrl: String!
    postId: String!
    createdAt: String
    updatedAt: String
  }

  extend type Mutation {
    postImages: PostImageOperations
  }

  type PostImageOperations {
    seedPostImages(payload: SeedPostImagesPayload): [PostImage]
  }

  input SeedPostImagesPayload {
    numberOfImages: Int
  }
`;
