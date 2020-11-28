const { GraphQLServer } = require("graphql-yoga");
const { createContext } = require("./context");
const Mutation = require("./resolvers/Mutation");
const Query = require("./resolvers/Query");
const typeDefs = require("./typedefs");

function createServer() {
  return new GraphQLServer({
    typeDefs,
    resolvers: {
      Mutation,
      Query,
    },
    resolverValidationOptions: {
      requireResolversForResolveType: false,
    },
    context: createContext,
  });
}

module.exports = createServer;
