const Query = {
  me: (parent, args, ctx) => {
    return ctx.prisma.user.findUnique();
  },
  user: (parent, args, ctx) => {
    return ctx.prisma.user.findUnique();
  },
  users: (parent, args, ctx) => {
    return ctx.prisma.user.findMany();
  },
  coursePage: (parent, args, ctx) => {
    return ctx.prisma.coursePage.findUnique();
  },
  coursePages: (parent, args, ctx) => {
    return ctx.prisma.coursePage.findMany();
  },
  lesson: (parent, args, ctx) => {
    return ctx.prisma.lesson.findUnique();
  },
  lessons: (parent, args, ctx) => {
    return ctx.prisma.lesson.findMany();
  },
  feed: (parent, args, ctx) => {
    return ctx.prisma.post.findMany({
      where: { published: true },
    });
  },
  filterPosts: (parent, args, ctx) => {
    return ctx.prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: args.searchString } },
          { content: { contains: args.searchString } },
        ],
      },
    });
  },
  post: (parent, args, ctx) => {
    return ctx.prisma.post.findUnique({
      where: { id: Number(args.where.id) },
    });
  },
};

module.exports = Query;
