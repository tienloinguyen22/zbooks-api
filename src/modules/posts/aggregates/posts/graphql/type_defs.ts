import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  extend type Query {
    posts: QueryPostsOperations
  }

  type QueryPostsOperations {
    findById(id: ID!): Post
    find(payload: FindPostsQuery!): PostQueryResult
  }

  type Post {
    id: ID!
    title: String
    condition: String
    description: String
    priceType: String
    price: Float
    postType: String
    ownerId: String
    shopId: String
    provinceId: String
    status: String
    usedHours: Int
    serialNo: String
    categoryId: String
    brandId: String
    modelId: String
    weight: Int
    releasedYear: String
    reviewedAt: String
    reviewedBy: String
    createdAt: String
    updatedAt: String
  }

  input FindPostsQuery {
    filter_textSearch: String
    orderBy: String
    pageIndex: Int
    itemsPerPage: Int
  }

  type PostQueryResult {
    data: [Post]
    pagination: OffsetPaginationResult
  }

  extend type Mutation {
    posts: PostOperations
  }

  type PostOperations {
    seedPosts(payload: SeedPostsPayload): [Post]
  }

  input SeedPostsPayload {
    numberOfPosts: Int
  }
`;
