import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  extend type Query {
    genders: [Gender!]!
  }

  type Gender {
    value: String!
    label: String!
  }
`;
