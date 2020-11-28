// const { GraphQLServer } = require("graphql-yoga");
const Mutation = require("./resolvers/Mutation");
const Query = require("./resolvers/Query");
// const db = require("./db");

const { GraphQLServer } = require("graphql-yoga");
const { schema } = require("./schema.js");
const { createContext } = require("./context");
const { PrismaClient } = require("@prisma/client");

// Create the GraphQL Yoga Server
//(GraphQL Yoga server unites all the technologies we need to use GraphQL)

function createServer() {
  return new GraphQLServer({
    // schema,
    typeDefs: "src/schema.graphql", // downloaded directly from the graphql playground, substituted prisma graphql
    resolvers: {
      Mutation, // Mutation: Mutation
      Query,
    },
    resolverValidationOptions: {
      requireResolversForResolveType: false,
    },
    context: (req) => ({
      ...req,
      prisma: new PrismaClient(),
    }),
  });
}

module.exports = createServer;
