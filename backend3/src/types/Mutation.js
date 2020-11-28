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
        const user = await ctx.prisma.user.findOne({ where: { email } });
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
  },
});

module.exports = {
  Mutation,
};
