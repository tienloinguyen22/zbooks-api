import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  extend type Query {
    user(id: ID!): User
    users(payload: UserQuery): UserQueryResult
  }

  type User {
    id: ID!
    username: String
    email: String
    firstName: String
    middleName: String
    lastName: String
    fullName: String
    phoneNo: String
    address: String
    avatarUrl: String
    dob: String
    gender: String
    loginDetail: ExternalLogin
    roles: [String!]
    registeredCompleted: Boolean
    isActive: Boolean
    registeredAt: String
    lastLoggedInAt: String
    createdBy: String
    createdAt: String
    lastModifiedBy: String
    lastModifiedAt: String
    firebaseId: String
  }

  type FacebookLogin {
    uid: String
    email: String
    loginType: String
  }

  type GoogleLogin {
    uid: String
    email: String
    loginType: String
  }

  type EmailLogin {
    email: String
    loginType: String
  }

  type PhoneNoLogin {
    phoneNo: String
    loginType: String
  }

  union ExternalLogin = FacebookLogin | GoogleLogin | EmailLogin | PhoneNoLogin

  input UserQuery {
    filter_textSearch: String
    # role: String
    # loginType: String
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
    create(payload: CreateUserCommand!): CommandResult
    update(payload: UpdateUserCommand!): CommandResult
    registerWithToken(payload: RegisterWithTokenCommand!): CommandResult
  }

  input CreateUserCommand {
    username: String!
    email: String!
    password: String!
    firstName: String!
    middleName: String
    lastName: String!
    phoneNo: String
    address: String
    avatarUrl: String
    dob: String
    gender: String
    roles: [String!]!
    isActive: Boolean!
  }

  input UpdateUserCommand {
    id: ID!
    username: String
    email: String
    password: String
    firstName: String
    middleName: String
    lastName: String
    phoneNo: String
    address: String
    avatarUrl: String
    dob: String
    gender: String
    roles: [String!]
    isActive: Boolean
  }

  input RegisterWithTokenCommand {
    token: String!
  }

  type CreateUserInputResult {
    id: String
  }
`;
