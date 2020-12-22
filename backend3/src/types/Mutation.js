const {
  list,
  intArg,
  objectType,
  booleanArg,
  mutationType,
  stringArg,
  arg,
} = require("@nexus/schema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const yandex = require("../yandexCheckout");
const postmark = require("postmark");

const WelcomeEmail = require("../emails/Welcome");
const PurchaseEmail = require("../emails/Purchase");
const ReminderEmail = require("../emails/Reminder");
const FinishEmail = require("../emails/Finish");
const NextWeekEmail = require("../emails/nextWeek");

const client = new postmark.ServerClient(process.env.MAIL_TOKEN);

const newOrderEmail = (client, surname, email, course, price) => `
  <div className="email" style="
    padding: 20px;
    font-family: sans-serif;
    line-height: 2;
    font-size: 20px;
  ">
    <h2>Привет!</h2>
    <p>${client} ${surname} оформил новый заказ.</p>
    <p> Имейл: ${email} </p>
    <p>Курс – ${course}, цена – ${price} </p>
  </div>
`;

const AuthorNotification = (lesson, course, lessonID) => `
  <div className="email" style="
    padding: 20px;
    font-family: sans-serif;
    line-height: 2;
    font-size: 20px;
  ">
    <h2>Привет!</h2>
    <p>Пришел новый вопрос по уроку "${lesson}" курса "${course}"</p>
    <button><a href="https://besavvy.app/lesson?id=${lessonID}&type=regular">Перейти</a></button>
  </div>
`;

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
            permissions: { set: ["USER"] },
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
        const user = await ctx.prisma.user.findUnique({
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

    t.field("updateUser", {
      type: "User",
      args: {
        id: stringArg(),
        // permissions: list(stringArg()),
        name: stringArg(),
        surname: stringArg(),
        email: stringArg(),
        status: arg({
          type: "Status", // name should match the name you provided
        }),
        isFamiliar: booleanArg(),
      },
      resolve: async (_, args, ctx) => {
        // const permissions = args.permissions;
        // delete args.permissions;
        const updates = { ...args };
        delete updates.id;
        console.log(updates);
        const user = await ctx.prisma.user.update({
          data: updates,
          where: {
            id: args.id,
          },
        });
        return user;
      },
    });

    t.field("enrollOnCourse", {
      type: "User",
      args: {
        coursePageId: stringArg(),
        id: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        console.log(-1, args.coursePageId);
        const coursePageId = args.coursePageId;
        delete args.coursePageId;
        const enrolledUser = await ctx.prisma.user.update({
          data: {
            new_subjects: {
              connect: { id: coursePageId },
            },
          },
          where: {
            id: args.id,
          },
        });
        const courseVisits = await ctx.prisma.courseVisit.findMany(
          {
            where: {
              student: { id: { equals: args.id } },
              coursePage: { id: { equals: args.coursePageId } },
            },
          },
          `{ student { id, name, email } }`
        );
        console.log(0);
        if (courseVisits.length === 0) {
          const CourseVisit = await ctx.prisma.courseVisit.create({
            data: {
              student: {
                connect: { id: args.id },
              },
              coursePage: {
                connect: { id: args.coursePage },
              },
              visitsNumber: 1,
            },
          });
        }
        return enrolledUser;
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
        progress: intArg(),
      },
      resolve: async (_, args, ctx) => {
        const updatedLessonResult = await ctx.prisma.lessonResult.update({
          data: { visitsNumber: args.visitsNumber, progress: args.progress },
          where: {
            id: args.id,
          },
        });
        return updatedLessonResult;
      },
    });
    t.field("updateCoursePage", {
      type: "CoursePage",
      args: {
        id: stringArg(),
        title: stringArg(),
        description: stringArg(),
        audience: stringArg(),
        result: stringArg(),
        news: stringArg(),
        tariffs: stringArg(),
        methods: stringArg(),
        image: stringArg(),
        video: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        const updates = { ...args };
        delete updates.id;
        const updatedCoursePage = await ctx.prisma.coursePage.update({
          data: updates,
          where: {
            id: args.id,
          },
        });
        return updatedCoursePage;
      },
    });
    t.field("updateLesson", {
      type: "Lesson",
      args: {
        id: stringArg(),
        number: intArg(),
        name: stringArg(),
        audience: stringArg(),
        text: stringArg(),
        description: stringArg(),
        type: stringArg(),
        tariffs: stringArg(),
        change: stringArg(),
        challenge_num: intArg(),
        open: booleanArg(),
        structure: arg({
          type: "LessonStructure",
        }),
      },
      resolve: async (_, args, ctx) => {
        const updates = { ...args };
        console.log(updates);
        delete updates.id;
        const updatedLesson = await ctx.prisma.lesson.update({
          data: updates,
          where: {
            id: args.id,
          },
        });
        return updatedLesson;
      },
    });
    t.field("createNewTest", {
      type: "NewTest",
      args: {
        lessonId: stringArg(),
        answers: list(stringArg()),
        correct: list(booleanArg()),
        question: list(stringArg()),
        ifRight: stringArg(),
        ifWrong: stringArg(),
      },
      resolve: async (
        _,
        { lessonId, answers, correct, question, ifRight, ifWrong },
        ctx
      ) => {
        const new_data = {
          user: {
            connect: { id: ctx.request.userId },
          },
          lesson: {
            connect: { id: lessonId },
          },
          answers: {
            set: [...answers],
          },
          correct: {
            set: [...correct],
          },
          question: {
            set: [...question],
          },
          ifRight,
          ifWrong,
        };

        const newTest = await ctx.prisma.newTest.create({ data: new_data });
        return newTest;
      },
    });
    t.field("createTestResult", {
      type: "TestResult",
      args: {
        answer: stringArg(),
        testID: stringArg(),
        lessonID: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        const TestResult = await ctx.prisma.testResult.create({
          data: {
            student: {
              connect: { id: ctx.request.userId },
            },
            test: {
              connect: { id: args.testID },
            },
            lesson: {
              connect: { id: args.lessonID },
            },
            ...args,
          },
        });
        // const test = await ctx.db.query.newTest(
        //   { where: { id: testID } },
        //   `{ id, answers, correct}`
        // );

        // let checker = [];
        // test.correct.map((el, index) => {
        //   if (el === true) {
        //     checker.push(test.answers[index]);
        //   }
        // });

        // if (checker.join(", ") === args.answer) {
        //   const user = await ctx.db.query.user(
        //     { where: { id: ctx.request.userId } },
        //     `{ id, level {id, level} }`
        //   );
        //   const updateUserLevel = await ctx.db.mutation.updateUserLevel(
        //     {
        //       data: {
        //         level: user.level.level + 1,
        //       },
        //       where: {
        //         id: user.level.id,
        //       },
        //     },
        //     info
        //   );
        // }

        return TestResult;
      },
    });
    t.field("updateNewTest", {
      type: "NewTest",
      args: {
        id: stringArg(),
        answers: list(stringArg()),
        correct: list(booleanArg()),
        question: list(stringArg()),
        ifRight: stringArg(),
        ifWrong: stringArg(),
        next: arg({
          type: "NextType", // name should match the name you provided
        }),
      },
      resolve: async (_, args, ctx) => {
        const updates = { ...args };
        delete updates.id;
        const updatedTest = await ctx.prisma.newTest.update({
          data: updates,
          where: {
            id: args.id,
          },
        });
        return updatedTest;
      },
    });
    t.field("deleteNewTest", {
      type: "NewTest",
      args: {
        id: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        console.log(args);
        const where = { id: args.id };
        const test = await ctx.prisma.newTest.findUnique(
          { where },
          `{ id, user { id } }`
        );
        const ownsTest = test.userId === ctx.request.userId;
        if (!ownsTest) {
          throw new Error("К сожалению, у вас нет полномочий на это.");
        }
        //3. Delete it
        return ctx.prisma.newTest.delete({ where });
      },
    });
    t.field("createQuiz", {
      type: "Quiz",
      args: {
        question: stringArg(),
        answer: stringArg(),
        lessonId: stringArg(),
        ifRight: stringArg(),
        ifWrong: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        console.log(args);
        const lessonId = args.lessonId;
        delete args.lessonId;
        const Quiz = await ctx.prisma.quiz.create({
          data: {
            user: {
              connect: { id: ctx.request.userId },
            },
            lesson: {
              connect: { id: lessonId },
            },
            ...args,
          },
        });
        return Quiz;
      },
    });
    t.field("updateQuiz", {
      type: "Quiz",
      args: {
        id: stringArg(),
        question: stringArg(),
        answer: stringArg(),
        lessonId: stringArg(),
        next: arg({
          type: "NextType", // name should match the name you provided
        }),
        ifRight: stringArg(),
        ifWrong: stringArg(),
        check: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        const updates = { ...args };
        delete updates.id;
        const updatedQuiz = await ctx.prisma.quiz.update({
          data: updates,
          where: {
            id: args.id,
          },
        });
        return updatedQuiz;
      },
    });
    t.field("deleteQuiz", {
      type: "Quiz",
      args: {
        id: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        console.log(args);
        const where = { id: args.id };
        const quiz = await ctx.prisma.quiz.findUnique(
          { where },
          `{ id, user { id } }`
        );
        const ownsTest = quiz.userId === ctx.request.userId;
        if (!ownsTest) {
          throw new Error("К сожалению, у вас нет полномочий на это.");
        }
        //3. Delete it
        return ctx.prisma.quiz.delete({ where });
      },
    });
    t.field("createQuizResult", {
      type: "QuizResult",
      args: {
        answer: stringArg(),
        correct: booleanArg(),
        quiz: stringArg(),
        lessonId: stringArg(),
      },

      resolve: async (_, args, ctx) => {
        const quiz = args.quiz;
        const lessonId = args.lessonId;
        delete args.quiz;
        delete args.lessonId;
        const QuizResult = await ctx.prisma.quizResult.create({
          data: {
            student: {
              connect: { id: ctx.request.userId },
            },
            quiz: {
              connect: { id: quiz },
            },
            lesson: {
              connect: { id: lessonId },
            },
            ...args,
          },
        });

        // if (args.correct === true) {
        //   const user = await ctx.db.query.user(
        //     { where: { id: ctx.request.userId } },
        //     `{ id, level {id, level} }`
        //   );
        //   const updateUserLevel = await ctx.db.mutation.updateUserLevel(
        //     {
        //       data: {
        //         level: user.level.level + 2,
        //       },
        //       where: {
        //         id: user.level.id,
        //       },
        //     },
        //     info
        //   );
        // }

        return QuizResult;
      },
    });
    t.field("createNote", {
      type: "Note",
      args: {
        lessonId: stringArg(),
        text: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        const lessonId = args.lessonId;
        delete args.lessonId;
        const Note = await ctx.prisma.note.create({
          data: {
            user: {
              connect: { id: ctx.request.userId },
            },
            lesson: {
              connect: { id: lessonId },
            },
            ...args,
          },
        });
        return Note;
      },
    });
    t.field("updateNote", {
      type: "Note",
      args: {
        id: stringArg(),
        text: stringArg(),
        next: arg({
          type: "NextType", // name should match the name you provided
        }),
      },
      resolve: async (_, args, ctx) => {
        const updates = { ...args };
        delete updates.id;
        return ctx.prisma.note.update({
          data: updates,
          where: {
            id: args.id,
          },
        });
      },
    });
    t.field("deleteNote", {
      type: "Note",
      args: {
        id: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        console.log(args);
        const where = { id: args.id };
        const note = await ctx.prisma.note.findUnique(
          { where },
          `{ id, user { id } }`
        );
        const ownsTest = note.userId === ctx.request.userId;
        if (!ownsTest) {
          throw new Error("К сожалению, у вас нет полномочий на это.");
        }
        //3. Delete it
        return ctx.prisma.note.delete({ where });
      },
    });
    t.field("createTextEditor", {
      type: "TextEditor",
      args: {
        lessonId: stringArg(),
        text: stringArg(),
        name: stringArg(),
        totalMistakes: intArg(),
      },
      resolve: async (_, args, ctx) => {
        const lessonId = args.lessonId;
        delete args.lessonId;
        const TE = await ctx.prisma.textEditor.create({
          data: {
            user: {
              connect: { id: ctx.request.userId },
            },
            lesson: {
              connect: { id: lessonId },
            },
            ...args,
          },
        });
        return TE;
      },
    });
    t.field("updateTextEditor", {
      type: "TextEditor",
      args: {
        id: stringArg(),
        text: stringArg(),
        name: stringArg(),
        totalMistakes: intArg(),
      },
      resolve: async (_, args, ctx) => {
        const updates = { ...args };
        delete updates.id;
        return ctx.prisma.textEditor.update({
          data: updates,
          where: {
            id: args.id,
          },
        });
      },
    });
    t.field("deleteTextEditor", {
      type: "TextEditor",
      args: {
        id: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        const where = { id: args.id };

        const TE = await ctx.prisma.textEditor.findUnique(
          { where },
          `{ id, user { id } }`
        );
        const ownsTest = TE.userId === ctx.request.userId;
        if (!ownsTest) {
          throw new Error("К сожалению, у вас нет полномочий на это.");
        }
        //3. Delete it
        return ctx.prisma.textEditor.delete({ where });
      },
    });
    t.field("createTextEditorResult", {
      type: "TextEditorResult",
      args: {
        lesson: stringArg(),
        textEditor: stringArg(),
        attempts: intArg(),
        wrong: stringArg(),
        correct: stringArg(),
        guess: stringArg(),
        result: booleanArg(),
      },
      resolve: async (_, args, ctx) => {
        const lesson = args.lesson;
        const textEditor = args.textEditor;
        delete args.lesson;
        delete args.textEditor;
        const TextEditorResult = await ctx.prisma.textEditorResult.create({
          data: {
            student: {
              connect: { id: ctx.request.userId },
            },
            textEditor: {
              connect: { id: textEditor },
            },
            lesson: {
              connect: { id: lesson },
            },
            ...args,
          },
        });

        // if (args.result === true) {
        //   const user = await ctx.db.query.user(
        //     { where: { id: ctx.request.userId } },
        //     `{ id, level {id, level} }`
        //   );
        //   const updateUserLevel = await ctx.db.mutation.updateUserLevel(
        //     {
        //       data: {
        //         level: user.level.level + 0.25,
        //       },
        //       where: {
        //         id: user.level.id,
        //       },
        //     },
        //   );
        // }
        return TextEditorResult;
      },
    });
    t.field("createConstruction", {
      type: "Construction",
      args: {
        lessonId: stringArg(),
        type: stringArg(),
        name: stringArg(),
        hint: stringArg(),
        variants: list(stringArg()),
        answer: list(stringArg()),
      },
      resolve: async (_, args, ctx) => {
        const lessonId = args.lessonId;
        delete args.lessonId;
        variants = args.variants;
        answer = args.answer;
        delete args.answer;
        delete args.variants;

        const construction = await ctx.prisma.construction.create({
          data: {
            user: {
              connect: { id: ctx.request.userId },
            },
            lesson: {
              connect: { id: lessonId },
            },
            variants: {
              set: [...variants],
            },
            answer: {
              set: [...answer],
            },
            ...args,
          },
        });
        return construction;
      },
    });
    t.field("updateConstruction", {
      type: "Construction",
      args: {
        id: stringArg(),
        type: stringArg(),
        name: stringArg(),
        hint: stringArg(),
        variants: list(stringArg()),
        answer: list(stringArg()),
      },
      resolve: async (_, args, ctx) => {
        const updates = { ...args };
        console.log(updates);
        delete updates.id;
        return ctx.prisma.construction.update({
          data: {
            variants: {
              set: [...updates.variants],
            },
            answer: {
              set: [...updates.answer],
            },
            name: updates.name,
            hint: updates.hint,
            type: updates.type,
          },
          where: {
            id: args.id,
          },
        });
      },
    });
    t.field("deleteConstruction", {
      type: "Construction",
      args: {
        id: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        const where = { id: args.id };

        const C = await ctx.prisma.construction.findUnique(
          { where },
          `{ id, user { id } }`
        );
        const ownsTest = C.userId === ctx.request.userId;
        if (!ownsTest) {
          throw new Error("К сожалению, у вас нет полномочий на это.");
        }
        //3. Delete it
        return ctx.prisma.construction.delete({ where });
      },
    });
    t.field("createConstructionResult", {
      type: "ConstructionResult",
      args: {
        answer: stringArg(),
        attempts: intArg(),
        constructionId: stringArg(),
        lessonId: stringArg(),
        inputs: list(stringArg()),
      },
      resolve: async (_, args, ctx) => {
        const lessonId = args.lessonId;
        const constructionId = args.constructionId;
        const inputs = args.inputs;
        delete args.lessonId;
        delete args.constructionId;
        delete args.inputs;
        const ConstructionResult = await ctx.prisma.constructionResult.create({
          data: {
            student: {
              connect: { id: ctx.request.userId },
            },
            construction: {
              connect: { id: constructionId },
            },
            lesson: {
              connect: { id: lessonId },
            },
            inputs: {
              set: [...inputs],
            },
            ...args,
          },
        });

        // if (args.result === true) {
        //   const user = await ctx.db.query.user(
        //     { where: { id: ctx.request.userId } },
        //     `{ id, level {id, level} }`
        //   );
        //   const updateUserLevel = await ctx.db.mutation.updateUserLevel(
        //     {
        //       data: {
        //         level: user.level.level + 0.25,
        //       },
        //       where: {
        //         id: user.level.id,
        //       },
        //     },
        //   );
        // }
        return ConstructionResult;
      },
    });
    t.field("createProblem", {
      type: "Problem",
      args: {
        lessonId: stringArg(),
        text: stringArg(),
        nodeID: stringArg(),
        nodeType: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        const lessonId = args.lessonId;
        delete args.lessonId;
        const problem = await ctx.prisma.problem.create({
          data: {
            user: {
              connect: { id: ctx.request.userId },
            },
            lesson: {
              connect: { id: lessonId },
            },
            ...args,
          },
        });
        return problem;
      },
    });
    t.field("updateProblem", {
      type: "Problem",
      args: {
        id: stringArg(),
        text: stringArg(),
        nodeID: stringArg(),
        nodeType: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        const updates = { ...args };
        //remove the ID from updates
        delete updates.id;
        //run the update method
        return ctx.prisma.problem.update({
          data: updates,
          where: {
            id: args.id,
          },
        });
      },
    });
    t.field("deleteProblem", {
      type: "Problem",
      args: {
        id: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        const where = { id: args.id };

        const C = await ctx.prisma.problem.findUnique(
          { where },
          `{ id, user { id } }`
        );
        const ownsTest = C.userId === ctx.request.userId;
        if (!ownsTest) {
          throw new Error("К сожалению, у вас нет полномочий на это.");
        }
        //3. Delete it
        return ctx.prisma.problem.delete({ where });
      },
    });
    t.field("createProblemResult", {
      type: "ProblemResult",
      args: {
        answer: stringArg(),
        revealed: list(stringArg()),
        lessonId: stringArg(),
        problemID: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        const lessonId = args.lessonId;
        const problemID = args.problemID;
        const revealed = args.revealed;
        delete args.lessonId;
        delete args.problemID;
        delete args.inputs;
        const ProblemResult = await ctx.prisma.problemResult.create({
          data: {
            student: {
              connect: { id: ctx.request.userId },
            },
            problem: {
              connect: { id: problemID },
            },
            lesson: {
              connect: { id: lessonId },
            },
            revealed: {
              set: [...revealed],
            },
            ...args,
          },
        });
        return ProblemResult;
      },
    });
    t.field("createForum", {
      type: "Forum",
      args: {
        lessonId: stringArg(),
        text: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        const lessonId = args.lessonId;
        delete args.lessonId;
        const forum = await ctx.prisma.forum.create({
          data: {
            user: {
              connect: { id: ctx.request.userId },
            },
            lesson: {
              connect: { id: lessonId },
            },
            ...args,
          },
        });
        return forum;
      },
    });
    t.field("updateForum", {
      type: "Forum",
      args: {
        id: stringArg(),
        text: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        const updates = { ...args };
        //remove the ID from updates
        delete updates.id;
        //run the update method
        return ctx.prisma.forum.update({
          data: updates,
          where: {
            id: args.id,
          },
        });
      },
    });
    t.field("createRating", {
      type: "Rating",
      args: {
        forumId: stringArg(),
        rating: intArg(),
      },
      resolve: async (_, args, ctx) => {
        const forumId = args.forumId;
        delete args.forumId;
        const rating = await ctx.prisma.rating.create({
          data: {
            user: {
              connect: { id: ctx.request.userId },
            },
            forum: {
              connect: { id: forumId },
            },
            ...args,
          },
        });
        return rating;
      },
    });
    t.field("updateRating", {
      type: "Rating",
      args: {
        id: stringArg(),
        rating: intArg(),
      },
      resolve: async (_, args, ctx) => {
        const updates = { ...args };
        //remove the ID from updates
        delete updates.id;
        //run the update method
        return ctx.prisma.rating.update({
          data: updates,
          where: {
            id: args.id,
          },
        });
      },
    });
    t.field("createStatement", {
      type: "Statement",
      args: {
        forumId: stringArg(),
        text: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        const forumId = args.forumId;
        delete args.forumId;
        const statement = await ctx.prisma.statement.create({
          data: {
            user: {
              connect: { id: ctx.request.userId },
            },
            forum: {
              connect: { id: forumId },
            },
            ...args,
          },
        });
        return statement;
      },
    });
    t.field("updateStatement", {
      type: "Statement",
      args: {
        id: stringArg(),
        text: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        const updates = { ...args };
        //remove the ID from updates
        delete updates.id;
        //run the update method
        return ctx.prisma.statement.update({
          data: updates,
          where: {
            id: args.id,
          },
        });
      },
    });
    t.field("deleteStatement", {
      type: "Statement",
      args: {
        id: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        const where = { id: args.id };

        const C = await ctx.prisma.statement.findUnique(
          { where },
          `{ id, user { id } }`
        );
        const ownsTest = C.userId === ctx.request.userId;
        if (!ownsTest) {
          throw new Error("К сожалению, у вас нет полномочий на это.");
        }
        //3. Delete it
        return ctx.prisma.statement.delete({ where });
      },
    });
    t.field("createShot", {
      type: "Shot",
      args: {
        lessonId: stringArg(),
        title: stringArg(),
        parts: list(stringArg()),
        comments: list(stringArg()),
      },
      resolve: async (_, args, ctx) => {
        const parts = args.parts;
        const comments = args.comments;
        const lessonId = args.lessonId;
        delete args.parts;
        delete args.comments;
        delete args.lessonId;
        const Shot = await ctx.prisma.shot.create({
          data: {
            user: {
              connect: { id: ctx.request.userId },
            },
            lesson: {
              connect: { id: lessonId },
            },
            parts: {
              set: [...parts],
            },
            comments: {
              set: [...comments],
            },
            ...args,
          },
        });
        return Shot;
      },
    });
    t.field("deleteShot", {
      type: "Shot",
      args: {
        id: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        const where = { id: args.id };

        const C = await ctx.prisma.shot.findUnique(
          { where },
          `{ id, user { id } }`
        );
        const ownsTest = C.userId === ctx.request.userId;
        if (!ownsTest) {
          throw new Error("К сожалению, у вас нет полномочий на это.");
        }
        //3. Delete it
        return ctx.prisma.shot.delete({ where });
      },
    });
    t.field("createShotResult", {
      type: "ShotResult",
      args: {
        answer: stringArg(),
        lessonId: stringArg(),
        shotId: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        const shotId = args.shotId;
        const lessonId = args.lessonId;
        delete args.shotId;
        delete args.lessonId;
        const ShotResult = await ctx.prisma.shotResult.create({
          data: {
            student: {
              connect: { id: ctx.request.userId },
            },
            lesson: {
              connect: { id: lessonId },
            },
            shot: {
              connect: { id: shotId },
            },
            ...args,
          },
        });
        return ShotResult;
      },
    });
    t.field("createDocument", {
      type: "Document",
      args: {
        lessonId: stringArg(),
        title: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        const lessonId = args.lessonId;
        delete args.lessonId;
        const Document = await ctx.prisma.document.create({
          data: {
            user: {
              connect: { id: ctx.request.userId },
            },
            lesson: {
              connect: { id: lessonId },
            },
            ...args,
          },
        });
        console.log(Document);
        return Document;
      },
    });
    t.field("deleteDocument", {
      type: "Document",
      args: {
        id: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        const where = { id: args.id };

        const C = await ctx.prisma.document.findUnique(
          { where },
          `{ id, user { id } }`
        );
        const ownsTest = C.userId === ctx.request.userId;
        if (!ownsTest) {
          throw new Error("К сожалению, у вас нет полномочий на это.");
        }
        //3. Delete it
        return ctx.prisma.document.delete({ where });
      },
    });
    t.field("createClause", {
      type: "Clause",
      args: {
        title: stringArg(),
        sample: stringArg(),
        keywords: list(stringArg()),
        number: intArg(),
        documentId: stringArg(),
        commentary: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        const documentId = args.documentId;
        delete args.documentId;
        const Clause = await ctx.prisma.clause.create({
          data: {
            user: {
              connect: { id: ctx.request.userId },
            },
            document: {
              connect: { id: documentId },
            },
            keywords: {
              set: [...args.keywords],
            },
            commentary: args.commentary,
            sample: args.sample,
            number: args.number,
          },
        });
        return Clause;
      },
    });
    t.field("updateClause", {
      type: "Clause",
      args: {
        id: stringArg(),
        text: stringArg(),
        commentary: stringArg(),
        sample: stringArg(),
        keywords: list(stringArg()),
      },
      resolve: async (_, args, ctx) => {
        const id = args.id;
        //remove the ID from updates
        delete args.id;
        //run the update method
        return ctx.prisma.clause.update({
          data: {
            keywords: {
              set: [...args.keywords],
            },
            commentary: args.commentary,
            sample: args.sample,
            number: args.number,
          },
          where: {
            id,
          },
        });
      },
    });
    t.field("deleteClause", {
      type: "Clause",
      args: {
        id: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        const where = { id: args.id };

        const C = await ctx.prisma.clause.findUnique(
          { where },
          `{ id, user { id } }`
        );
        const ownsTest = C.userId === ctx.request.userId;
        if (!ownsTest) {
          throw new Error("К сожалению, у вас нет полномочий на это.");
        }
        //3. Delete it
        return ctx.prisma.clause.delete({ where });
      },
    });
    t.field("createDocumentResult", {
      type: "DocumentResult",
      args: {
        documentId: stringArg(),
        answers: list(stringArg()),
        drafts: list(stringArg()),
      },
      resolve: async (_, args, ctx) => {
        const documentId = args.documentId;
        delete args.documentId;
        const DocumentResult = await ctx.prisma.documentResult.create({
          data: {
            user: {
              connect: { id: ctx.request.userId },
            },
            document: {
              connect: { id: documentId },
            },
            answers: {
              set: [...answers],
            },
            drafts: {
              set: [...drafts],
            },
          },
        });
        return DocumentResult;
      },
    });
    t.field("createOrder", {
      type: "PaymentInfo",
      args: {
        coursePageId: stringArg(),
        userId: stringArg(),
        promocode: stringArg(),
        comment: stringArg(),
        price: intArg(),
      },
      resolve: async (_, args, ctx) => {
        // 1.
        const result = await yandex.createPayment({
          amount: {
            value: args.price,
            currency: "RUB",
          },
          payment_method_data: {
            type: "bank_card",
          },
          confirmation: {
            type: "redirect",
            return_url: "https://www.besavvy.app/",
          },
          capture: true,
        });

        const url = result.confirmation.confirmation_url;

        // 2.
        const paymentID = result.id;
        const user = await ctx.prisma.user.findUnique({
          where: { id: args.userId },
        });
        const coursePage = await ctx.prisma.coursePage.findUnique({
          where: { id: args.coursePageId },
        });

        const order = await ctx.prisma.order.create({
          data: {
            price: args.price,
            paymentID: paymentID,
            promocode: args.promocode,
            comment: args.comment,
            user: {
              connect: { id: args.userId },
            },
            coursePage: {
              connect: { id: args.coursePageId },
            },
          },
        });

        // 3.

        const newOrderMail = await client.sendEmail({
          From: "Mikhail@besavvy.app",
          To: "Mi.Kochkin@ya.ru",
          Subject: "Новый клиент",
          HtmlBody: newOrderEmail(
            user.name,
            user.surname,
            user.email,
            coursePage.title,
            args.price
          ),
        });

        return { url, order };
      },
    });
    t.field("updateOrder", {
      type: "Order",
      args: {
        id: stringArg(),
        isPaid: booleanArg(),
      },
      resolve: async (_, args, ctx) => {
        console.log(1, args.isPaid);
        if (args.isPaid === true) {
          const order = await ctx.prisma.order.findUnique(
            {
              where: { id: args.id },
              include: {
                user: true,
                coursePage: true,
              },
            },
            `{ id, user { name, email}, coursePage {id, title} }`
          );
          console.log(order.user.email);
          const notification = await client.sendEmail({
            From: "Mikhail@besavvy.app",
            To: order.user.email,
            Subject: "🎆 BeSavvy: доступ к курсу открыт!",
            HtmlBody: PurchaseEmail.PurchaseEmail(
              order.user.name,
              order.coursePage.title,
              order.coursePage.id
            ),
          });
        }
        console.log(2);
        return ctx.prisma.order.update({
          data: {
            isPaid: args.isPaid,
          },
          where: {
            id: args.id,
          },
        });
      },
    });
    t.field("deleteOrder", {
      type: "Order",
      args: {
        id: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        const where = { id: args.id };

        const C = await ctx.prisma.order.findUnique(
          { where },
          `{ id, user { id } }`
        );
        const ownsTest = C.userId === ctx.request.userId;
        if (!ownsTest) {
          throw new Error("К сожалению, у вас нет полномочий на это.");
        }
        //3. Delete it
        return ctx.prisma.order.delete({ where });
      },
    });
    t.field("createPost", {
      type: "Post",
      args: {
        text: stringArg(),
        title: stringArg(),
      },
      resolve: async (_, args, ctx) => {
        const post = await ctx.prisma.post.create({
          data: {
            user: {
              connect: { id: ctx.request.userId },
            },
            ...args,
          },
        });
        return post;
      },
    });
    t.field("updatePost", {
      type: "Post",
      args: {
        text: stringArg(),
        id: stringArg(),
      },
      resolve: async (_, { text, id }, ctx) => {
        const updatedPost = await ctx.prisma.post.update({
          where: { id },
          data: { text },
        });
        return updatedPost;
      },
    });
  },
});

module.exports = {
  Mutation,
};
