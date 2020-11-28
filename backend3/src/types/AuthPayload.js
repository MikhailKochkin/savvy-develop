const { objectType } = require("@nexus/schema");

const AuthPayload = objectType({
  name: "AuthPayload",
  definition(t) {
    t.string("token");
    t.field("user", { type: "User" });
  },
});

const SignOut = objectType({
  name: "SignOut",
  definition(t) {
    t.string("message");
  },
});

module.exports = { AuthPayload, SignOut };
