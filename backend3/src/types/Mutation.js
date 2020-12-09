const {
  intArg,
  objectType,
  booleanArg,
  mutationType,
  stringArg,
} = require("@nexus/schema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Mutation = mutationType({
  name: "Mutation",
  definition(t) {
    t.field("signup", {
      type: "AuthPayload",
      args: {
        name: stringArg(),
        surname: stringArg(),
        email: stringArg(),
        password: stringArg(),
        uniID: stringArg(),
        careerTrackID: stringArg(),
        company: stringArg(),
      },
      resolve: async (
        _,
        { name, surname, email, uniID, password, careerTrackID, company },
        ctx
      ) => {
        const hashed_password = await bcrypt.hash(password, 10);

        const user = await ctx.prisma.user.create({
          data: {
            name,
            surname,
            email,
            password: hashed_password,
            uni: { connect: { id: uniID } },
            company: { connect: { id: company } },
            careerTrack: { connect: { id: careerTrackID } },
          },
        });

        let token = jwt.sign({ userId: user.id }, process.env.APP_SECRET, {
          expiresIn: 1000 * 60 * 60 * 24 * 365,
        });
        console.log(token);
        return { user, token };
      },
    });
    t.field("signin", {
      type: "AuthPayload",
      args: {
        email: stringArg(),
        password: stringArg(),
      },
      resolve: async (_, { email, password }, ctx) => {
        // 1. check if there is a user with that email
        const low_email = email.toLowerCase();
        const user = await ctx.prisma.user.findOne({
          where: { email: low_email },
        });
        if (!user) {
          throw new Error(`No such user found for email ${email}`);
        }
        // 2. Check if their password is correct
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
          throw new Error("Invalid Password!");
        }
        // 3. generate the JWT Token
        let token = jwt.sign({ userId: user.id }, process.env.APP_SECRET, {
          expiresIn: 1000 * 60 * 60 * 24 * 365,
        });
        // 4. Return the user and token
        return { user, token };
      },
    });
    t.field("signout", {
      type: "SignOut",
      resolve: async (_, args, ctx) => {
        return { message: "Goodbye!" };
      },
    });
    t.field("createCoursePage", {
      type: "CoursePage",
      args: {
        title: stringArg(),
        description: stringArg(),
        image: stringArg(),
        courseType: stringArg(),
        published: booleanArg(),
      },
      resolve: async (_, args, ctx) => {
        console.log(ctx.request.userId);
        const coursePage = await ctx.prisma.coursePage.create({
          data: {
            user: {
              connect: {
                id: ctx.request.userId,
              },
            },
            // uni: {
            //   connect: {
            //     id: uniID,
            //   },
            // },
            ...args,
          },
        });
        return coursePage;
      },
    });
    t.field("createCourseVisit", {
      type: "CourseVisit",
      args: {
        visitsNumber: intArg(),
        coursePageId: stringArg(),
      },
      resolve: async (_, { visitsNumber, coursePageId }, ctx) => {
        const courseVisit = await ctx.prisma.courseVisit.create({
          data: {
            coursePage: {
              connect: {
                id: coursePageId,
              },
            },
            student: {
              connect: {
                id: ctx.request.userId,
              },
            },
            visitsNumber,
          },
        });
        return courseVisit;
      },
    });
    t.field("updateCourseVisit", {
      type: "CourseVisit",
      args: {
        visitsNumber: intArg(),
        id: stringArg(),
      },
      resolve: async (_, { visitsNumber, id }, ctx) => {
        const courseVisit = await ctx.prisma.courseVisit.update({
          where: { id },
          data: { visitsNumber },
        });
        return courseVisit;
      },
    });
    t.field("createLesson", {
      type: "Lesson",
      args: {
        number: intArg(),
        name: stringArg(),
        text: stringArg(),
        description: stringArg(),
        coursePageID: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        const Lesson = await ctx.prisma.lesson.create({
          data: {
            user: {
              connect: { id: ctx.request.userId },
            },
            coursePage: {
              connect: { id: args.coursePageID },
            },
            ...args,
          },
        });
        return Lesson;
      },
    });
    t.field("updatePublished", {
      type: "Lesson",
      args: {
        id: stringArg(),
        published: booleanArg(),
      },
      resolve: async (_, args, ctx) => {
        const published = await ctx.prisma.lesson.update({
          data: { published: args.published },
          where: {
            id: args.id,
          },
        });
        return published;
      },
    });
    t.field("createLessonResult", {
      type: "LessonResult",
      args: {
        visitsNumber: intArg(),
        lessonID: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        const LessonResult = await ctx.prisma.lessonResult.create({
          data: {
            student: {
              connect: { id: ctx.request.userId },
            },
            lesson: {
              connect: { id: args.lessonID },
            },
            ...args,
          },
        });
        return LessonResult;
      },
    });
    t.field("updateLessonResult", {
      type: "LessonResult",
      args: {
        id: stringArg(),
        visitsNumber: intArg(),
      },
      resolve: async (_, args, ctx) => {
        const updatedLessonResult = await ctx.prisma.lessonResult.update({
          data: { visitsNumber: args.visitsNumber },
          where: {
            id: args.id,
          },
        });
        return updatedLessonResult;
      },
    });
  },
});

module.exports = {
  Mutation,
};
