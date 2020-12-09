const { objectType } = require("@nexus/schema");

const NewTest = objectType({
  name: "NewTest",
  definition(t) {
    t.model.id();
    t.model.ifRight();
    t.model.ifWrong();
    t.model.type();
    t.model.lessonID();
    t.model.next();
    t.model.question();
    t.model.answers();
    t.model.correct();
    t.model.userId();
    t.model.lessonId();
    t.model.userId();
    t.model.user();
    t.model.lesson();
    t.model.testResults();
    t.model.createdAt();
    t.model.updatedAt();
  },
});

const Shot = objectType({
  name: "Shot",
  definition(t) {
    t.model.id();
    t.model.title();
    t.model.parts();
    t.model.comments();
    t.model.userId();
    t.model.lessonId();
    t.model.user();
    t.model.lesson();
    t.model.createdAt();
    t.model.updatedAt();
  },
});

const Quiz = objectType({
  name: "Quiz",
  definition(t) {
    t.model.id();
    t.model.question();
    t.model.answer();
    t.model.type();
    t.model.ifRight();
    t.model.ifWrong();
    t.model.lessonID();
    t.model.next();
    t.model.check();
    t.model.userId();
    t.model.lessonId();
    t.model.lesson();
    t.model.user();
    t.model.quizResults();
    t.model.createdAt();
    t.model.updatedAt();
  },
});

const Note = objectType({
  name: "Note",
  definition(t) {
    t.model.id();
    t.model.text();
    t.model.next();
    t.model.userId();
    t.model.lessonId();
    t.model.lesson();
    t.model.user();
    t.model.lessonID();
    t.model.createdAt();
    t.model.updatedAt();
  },
});

module.exports = {
  NewTest,
  Shot,
  Quiz,
  Note,
};
