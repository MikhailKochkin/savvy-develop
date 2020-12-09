const { objectType } = require("@nexus/schema");

const User = objectType({
  name: "User",
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.surname();
    t.model.email();
    t.model.password();
    t.model.description();
    t.model.resume();
    t.model.status();
    t.model.uni();
    t.model.new_subjects();
    t.model.permissions();
    t.model.courseVisits();
    t.model.lessons();
    t.model.coursePages({ ordering: { title: true } });
    t.model.company();
  },
});

module.exports = {
  User,
};
