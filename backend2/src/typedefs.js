const typeDefs = `
type User {
  email: String!
  id: ID!
  name: String
  surname: String
  password: String
}

type Post {
  author: User
  content: String
  id: ID!
  published: Boolean!
  title: String!
}

type Bro {
  id: ID!
  name: String
  points: Int
}

type Application {
  id: ID!
}

type CareerTrack {
  id: ID!
}

type ExamQuestion {
  id: ID!
}

type Uni {
  id: ID!
}

type Article {
  id: ID!
}

enum CourseType {
  PUBLIC
  PRIVATE
  FORMONEY
  UNI
  CHALLENGE
}

type Order {
  id: ID!
}

type Company {
  id: ID!
}

type CourseVisit {
  id: ID!
}

type CoursePage {
  id: ID!
  title: String!
  description: String
  image: String!
  banner: String
  problem: String
  target_audience: String
  skills: [String]
  news: String
  user: User!
  authors: [User]
  audience: String
  result: String
  tariffs: String
  methods: String
  video: String
  reviews: Json
  lessons: [Lesson]
  applications: [Application]
  careerTrack: [CareerTrack]
  numInCareerTrack: Int
  examQuestion: ExamQuestion
  published: Boolean
  uni: Uni
  uniID: String
  articles: [Article]
  tags: [String]
  courseType: CourseType
  students: [String]
  new_students: [User]
  price: Int
  discountPrice: Int
  orders: [Order]
  company: Company
  promocode: [Json]
  visits: [CourseVisit]
  package: [CoursePage]
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Lesson {
  id: ID!
}

type Query {
  user: User!
  users: [User!]!
  me: User!
  coursePage: CoursePage!
  coursePages: [CoursePage!]!
  lesson: Lesson!
  lessons: [Lesson!]!
  feed: [Post!]!
  filterPosts(searchString: String): [Post!]!
  post(where: PostWhereUniqueInput!): Post
  bros: [Bro]
}

type Mutation {
  createDraft(authorEmail: String, content: String, title: String!): Post!
  deleteOneBro(id: ID): Bro
  signup(name: String, surname: String, email: String, password: String): User!
  createBro(points: Int, name: String): User!
  updateUser(id: ID, email: String, name: String): User
  updateOneBro(data: BroUpdateInput): Bro
  deleteOnePost(where: PostWhereUniqueInput!): Post
  publish(id: ID): Post
}

input PostWhereUniqueInput {
  id: ID
}

input BroUpdateInput {
  id: String
  name: String
  points: Int
}

input UserCreateInput {
  email: String!
  id: ID
  name: String
}

input PostCreateManyWithoutPostsInput {
  connect: [PostWhereUniqueInput!]
  create: [PostCreateWithoutAuthorInput!]
}

input PostCreateWithoutAuthorInput {
  content: String
  id: ID
  published: Boolean
  title: String!
}
`;

module.exports = typeDefs;
