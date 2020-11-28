const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");

const Mutation = {
  signup: async (parent, args, ctx, info) => {
    // lower the email
    args.email = args.email.toLowerCase();
    const uniID = args.uniID;
    const careerTrackID = args.careerTrackID;
    const company = args.company;
    delete args.uniID;
    delete args.company;
    // hash the password
    const password = await bcrypt.hash(args.password, 10);
    //create the user
    const user = await ctx.prisma.user.create(
      {
        data: {
          ...args,
          password,
          permissions: { set: ["USER"] },
        },
      },
      info
    );
    console.log("!");
    // create the JWT token for them
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // we set the jwt as a cookie on the response
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
    });
    // return the user to the browser
    return user;
  },
  updateUser: (parent, args, ctx) => {
    const updates = { ...args };
    delete updates.id;
    return ctx.prisma.user.update({
      where: { id: Number(args.id) },
      data: { email: args.email },
    });
  },
  createBro: (parent, args, ctx) => {
    console.log(args);
    return ctx.prisma.bro.create({
      data: {
        points: args.points,
        name: args.name,
      },
    });
  },
  updateOneBro: (parent, args, ctx) => {
    console.log(args.data.id, args.data.points);
    return ctx.prisma.bro.update({
      where: { id: parseInt(args.data.id) },
      data: { name: args.data.name, points: args.data.points },
    });
  },
  deleteOneBro: (parent, args, ctx) => {
    return ctx.prisma.bro.delete({
      where: { id: Number(args.id) },
    });
  },
  createDraft: (parent, args, ctx) => {
    return ctx.prisma.post.create({
      data: {
        title: args.title,
        content: args.content,
        published: false,
        author: {
          connect: { email: args.authorEmail },
        },
      },
    });
  },
  deleteOnePost: (parent, args, ctx) => {
    return ctx.prisma.post.delete({
      where: { id: Number(args.where.id) },
    });
  },
  publish: (parent, args, ctx) => {
    return ctx.prisma.post.update({
      where: { id: Number(args.id) },
      data: { published: true },
    });
  },
};

module.exports = Mutation;
