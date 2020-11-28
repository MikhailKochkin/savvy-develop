const { idArg, queryType, stringArg } = require("@nexus/schema");

const Query = queryType({
  name: "Query",
  definition(t) {
    t.crud.users();
    t.crud.coursePages();
    // t.crud.coursePages("coursePages", {
    //   type: "CoursePage",
    //   // args: {
    //   //   id: idArg(),
    //   // },
    //   resolve: async (_, args, ctx) => {
    //     return ctx.prisma.coursePage.findMany({
    //       orderBy: {
    //         createdAt: "desc",
    //       },
    //       // where: {
    //       //   user: id,
    //       // },
    //     });
    //   },
    // });
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
