const { objectType } = require("@nexus/schema");

const Application = objectType({
  name: "Application",
  definition(t) {
    t.model.id();
    t.model.createdAt();
    t.model.updatedAt();
  },
});

module.exports = {
  Application,
};
