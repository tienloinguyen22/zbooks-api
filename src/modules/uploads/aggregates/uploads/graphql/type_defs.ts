import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  extend type Mutation {
    uploads: FileUploadsOperations
  }

  type FileUploadsOperations {
    image(file: Upload!): FileUploadResult!
  }

  type FileUploadResult {
    filename: String!
    url: String!
  }
`;
