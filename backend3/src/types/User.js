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
    t.model.interests();
    t.model.level();
    t.model.uni();
    t.model.new_subjects();
    t.model.permissions();
    t.model.courseVisits();
    t.model.lessons();
    t.model.studentFeedback();
    t.model.teacherFeedback();
    t.model.coursePages({ ordering: { title: true } });
    t.model.company();
    t.model.lessonResults();
  },
});

const Feedback = objectType({
  name: "Feedback",
  definition(t) {
    t.model.id();
    t.model.text();
    t.model.teacherId();
    t.model.studentId();
    t.model.lessonId();
    t.model.lesson();
    t.model.teacher();
    t.model.student();
    t.model.createdAt();
    t.model.updatedAt();
  },
});

const UserLevel = objectType({
  name: "UserLevel",
  definition(t) {
    t.model.id();
    t.model.level();
    t.model.userId();
    t.model.user();
    t.model.createdAt();
    t.model.updatedAt();
  },
});

module.exports = {
  User,
  Feedback,
  UserLevel,
};
