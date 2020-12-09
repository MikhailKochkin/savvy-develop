const { objectType } = require("@nexus/schema");

const Lesson = objectType({
  name: "Lesson",
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.number();
    t.model.text();
    t.model.type();
    t.model.description();
    t.model.open();
    t.model.coursePageID();
    t.model.change();
    t.model.challenge_num();
    t.model.published();
    t.model.map();
    t.model.userId();
    t.model.coursePageId();
    t.model.forumId();
    t.model.coursePage();
    t.model.structure();
    // t.model.forum();
    t.model.user();
    t.model.lessonResults();
    // t.model.constructionResults();
    t.model.challengeResults();
    t.model.constructionResults();
    t.model.testResults();
    t.model.shotResults();
    t.model.quizResults();
    t.model.problemResults();
    t.model.textEditorResults();
    t.model.shots();
    t.model.notes();
    t.model.quizes();
    t.model.documents();
    t.model.forum();
    t.model.newTests();
    t.model.problems();
    t.model.constructions();
    t.model.texteditors();
    t.model.createdAt();
    t.model.updatedAt();
  },
});

const LessonResults = objectType({
  name: "LessonResult",
  definition(t) {
    t.model.id();
    t.model.student();
    t.model.visitsNumber();
    t.model.lessonID();
    t.model.createdAt();
    t.model.updatedAt();
  },
});

// documents           Document[]
// documentResults     DocumentResult[]
// lessonFeedback      Feedback[]
// lessonResults       LessonResult[]
// newTests            NewTest[]
// notes               Note[]
// problems            Problem[]
// problemResults      ProblemResult[]
// quizes              Quiz[]
// quizResults         QuizResult[]
// shots               Shot[]
// shotResults         ShotResult[]
// testResults         TestResult[]
// texteditors         TextEditor[]
// textEditorResults   TextEditorResult[]

module.exports = {
  Lesson,
  LessonResults,
};
