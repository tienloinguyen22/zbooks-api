import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  extend type Query {
    countries: [Country!]!
  }

  type Country {
    name: String
    dialCode: String
    code: String
  }
`;
