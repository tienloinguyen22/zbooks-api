import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  extend type Query {
    users: QueryUsersOperations
  }

  type QueryUsersOperations {
    findById(id: ID!): User
    find(payload: FindUsersQuery!): UserQueryResult
    findByToken(payload: FindUserByTokenQuery!): User
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

  input FindUserByTokenQuery {
    token: String!
  }

  input FindUsersQuery {
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
    registerWithToken(payload: RegisterWithTokenPayload!): User
  }

  input RegisterWithTokenPayload {
    token: String!
    fullName: String!
    email: String!
  }
`;
