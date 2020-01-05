import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  extend type Query {
    role(id: ID!): Role
    roles(payload: RoleQuery): RoleQueryResult
  }

  type Role {
    id: ID!
    name: String
    description: String
    permissions: [String]
    createdBy: String
    createdAt: String
    lastModifiedBy: String
    lastModifiedAt: String
  }

  input RoleQuery {
    filter_textSearch: String
    orderBy: String
    pageIndex: Int
    itemsPerPage: Int
  }

  type RoleQueryResult {
    data: [Role]
    pagination: OffsetPaginationResult
  }

  extend type Mutation {
    roles: RoleOperations
  }

  type RoleOperations {
    create(payload: CreateRoleCommand!): CommandResult
    update(payload: UpdateRoleCommand!): CommandResult
    delete(payload: DeleteRoleCommand!): CommandResult
  }

  input CreateRoleCommand {
    name: String
    description: String
    permissions: [String]!
  }

  input UpdateRoleCommand {
    id: ID!
    name: String
    description: String
    permissions: [String]
  }

  input DeleteRoleCommand {
    id: ID!
  }
`;
