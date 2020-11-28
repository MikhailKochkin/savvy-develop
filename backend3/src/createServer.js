const { GraphQLServer } = require("graphql-yoga");
const { PrismaClient } = require("@prisma/client");
const { nexusPrisma } = require("nexus-plugin-prisma");
const { makeSchema, connectionPlugin } = require("@nexus/schema");
const types = require("./types");

const prisma = new PrismaClient();

function createServer() {
  return new GraphQLServer({
    context: (request) => {
      return {
        ...request,
        prisma,
      };
    },
    schema: makeSchema({
      types,
      plugins: [nexusPrisma({ experimentalCRUD: true }), connectionPlugin()],
      outputs: {
        schema: __dirname + "/../schema.graphql",
        typegen: __dirname + "/generated/nexus.ts",
      },
      // typegenAutoConfig: {
      //   contextType: "Context.Context",
      //   sources: [
      //     {
      //       source: "@prisma/client",
      //       alias: "prisma",
      //     },
      //     {
      //       source: require.resolve("./context.js"),
      //       alias: "context",
      //     },
      //   ],
      // },
    }),
  });
}

exports.createServer = createServer;
exports.prisma = prisma;
