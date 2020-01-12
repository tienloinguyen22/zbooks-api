import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  extend type Query {
    user(id: ID!): User
    users(payload: UserQuery): UserQueryResult
  }

  type User {
    id: ID!
    firebaseId: String!
    email: String!
    fullName: String!
    countryCode: String
    lineNumber: String
    phoneNo: String
    address: String
    avatarUrl: String
    dob: String
    gender: Genders
    loginDetail: ExternalLogin
    isActive: Boolean
    lastLoggedInAt: String
    createdBy: String
    createdAt: String
    lastModifiedBy: String
    lastModifiedAt: String
  }

  type ExternalLogin {
    uid: String!
    loginType: LoginTypes
  }

  input UserQuery {
    filter_textSearch: String
    orderBy: String
    pageIndex: Int
    itemsPerPage: Int
  }

  type UserQueryResult {
    data: [User]
    pagination: OffsetPaginationResult
  }

  extend type Mutation {
    users: UserOperations
  }

  type UserOperations {
    registerWithToken(payload: RegisterWithTokenCommand!): CommandResult
  }

  input RegisterWithTokenCommand {
    token: String!
    fullName: String!
    email: String!
  }
`;
