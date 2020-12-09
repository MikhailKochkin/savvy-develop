const { idArg, queryType, stringArg } = require("@nexus/schema");

const Query = queryType({
  name: "Query",
  definition(t) {
    t.crud.users();
    t.crud.coursePages({ ordering: true, filtering: true });
    t.crud.coursePage({ ordering: true, filtering: true });
    t.crud.courseVisits({ ordering: true, filtering: true });
    t.crud.lesson({ ordering: true, filtering: true });
    t.field("lessonsConnection", {
      type: "Lesson",
      resolve: async (_, _args, ctx) => {
        const lessonsConnection = await prisma.lessons.aggregate();
        console.log(lessonsConnection);
        return lessonsConnection;
      },
    });
    t.field("me", {
      type: "User",
      resolve: async (_, _args, ctx) => {
        if (!ctx.request.userId) {
          return null;
        }
        const user = await ctx.prisma.user.findOne({
          where: { id: ctx.request.userId },
        });
        return user;
      },
    });
  },
});

module.exports = {
  Query,
};
