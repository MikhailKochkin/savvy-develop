const { objectType } = require("@nexus/schema");

const Lesson = objectType({
  name: "Lesson",
  definition(t) {
    t.model.id();
    t.model.createdAt();
    t.model.updatedAt();
  },
});

module.exports = {
  Lesson,
};
