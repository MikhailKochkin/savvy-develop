const { forwardTo } = require("prisma-binding");
const { hasPermission } = require("../utils");

const Query = {
  coursePages: forwardTo("db"),
  coursePage: forwardTo("db"),
  lesson: forwardTo("db"),
  quiz: forwardTo("db"),
  newTest: forwardTo("db"),
  problem: forwardTo("db"),
  textEditor: forwardTo("db"),
  careerTrack: forwardTo("db"),
  careerTracks: forwardTo("db"),
  lessonResults: forwardTo("db"),
  order: forwardTo("db"),
  coursePagesConnection: forwardTo("db"),
  lessonsConnection: forwardTo("db"),
  problemsConnection: forwardTo("db"),
  applications: forwardTo("db"),
  courseVisits: forwardTo("db"),
  note: forwardTo("db"),
  documentResults: forwardTo("db"),
  lessons(parent, args, ctx, info) {
    const pageId = args.where.coursePageID;
    return ctx.db.query.lessons(
      {
        where: { coursePageID: pageId },
      },
      info
    );
  },
  newTests(parent, args, ctx, info) {
    const courseType = args.where.courseType;
    return ctx.db.query.newTests(
      {
        where: { lessonID: lesID },
      },
      info
    );
  },
  quizzes(parent, args, ctx, info) {
    const lesID = args.where.lessonID;
    return ctx.db.query.newTests(
      {
        where: { lessonID: lesID },
      },
      info
    );
  },

  problems(parent, args, ctx, info) {
    const lesID = args.where.lessonID;
    return ctx.db.query.problems(
      {
        where: { lessonID: lesID },
      },
      info
    );
  },
  textEditors(parent, args, ctx, info) {
    const lesID = args.where.lessonID;
    return ctx.db.query.textEditors(
      {
        where: { lessonID: lesID },
      },
      info
    );
  },
  applications(parent, args, ctx, info) {
    return ctx.db.query.applications({}, info);
  },
  me(parent, args, ctx, info) {
    // check if there is a current user ID
    if (!ctx.request.userId) {
      return null;
    }
    return ctx.db.query.user(
      {
        where: { id: ctx.request.userId },
      },
      info
    );
  },
  async users(parent, args, ctx, info) {
    // 1. Check if they are logged in
    if (!ctx.request.userId) {
      throw new Error("You must be logged in!");
    }
    // 2. if they do, query all the users!
    return ctx.db.query.users({}, info);
  },
  async orders(parent, args, ctx, info) {
    return ctx.db.query.orders({}, info);
  },
};

module.exports = Query;
