const { makeExecutableSchema } = require("graphql-tools");
const { Context } = require("./context");
const Mutation = require("./resolvers/Mutation");
const Query = require("./resolvers/Query");

const resolvers = {
  Query,
  Mutation,
};

const schema = makeExecutableSchema({
  resolvers,
});

module.exports = {
  schema,
};
