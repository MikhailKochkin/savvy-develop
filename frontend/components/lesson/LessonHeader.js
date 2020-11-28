import React, { Component } from "react";
import gql from "graphql-tag";
import { Mutation, Query } from "@apollo/client/react/components";
import styled from "styled-components";
import Link from "next/link";
import renderHTML from "react-render-html";
import { SINGLE_COURSEPAGE_QUERY } from "../course/CoursePage";

const UPDATE_PUBLISHED_MUTATION = gql`
  mutation UPDATE_PUBLISHED_MUTATION($id: ID!, $published: Boolean) {
    updatePublished(id: $id, published: $published) {
      id
      number
      name
      text
    }
  }
`;

const CREATE_LESSONRESULT_MUTATION = gql`
  mutation CREATE_LESSONRESULT_MUTATION($visitsNumber: Int, $lessonID: ID) {
    createLessonResult(visitsNumber: $visitsNumber, lessonID: $lessonID) {
      id
    }
  }
`;

const UPDATE_LESSONRESULT_MUTATION = gql`
  mutation UPDATE_LESSONRESULT_MUTATION($id: ID!, $visitsNumber: Int) {
    updateLessonResult(id: $id, visitsNumber: $visitsNumber) {
      id
    }
  }
`;

const TextBar = styled.div`
  display: grid;
  grid-template-columns: 65% 35%;
  width: 100%;
  font-size: 1.6rem;
  margin-bottom: 15px;
  border-left: 2px solid;
  border-color: ${(props) => props.color};
  padding: 2%;
  padding-left: 2%;
  background: ${(props) => (props.open ? "#F0F8FF" : "none")};
  span {
    cursor: pointer;
    &:hover {
      color: red;
    }
  }
  @media (max-width: 1000px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 3%;
  }
`;

const A = styled.a`
  justify-self: center;
  align-self: center;
`;

const Text = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-right: 25px;
  div {
    padding: 2% 0% 2% 0%;
  }
  .arrow {
    cursor: pointer;
  }
`;

const Button = styled.button`
  font-size: 1.6rem;
  padding: 5%;
  background: #ffffff;
  border: 1px solid #112a62;
  color: #112a62;
  box-sizing: border-box;
  border-radius: 5px;
  width: 100px;
  height: 40px;
  cursor: pointer;
  outline: 0;
  @media (max-width: 800px) {
    font-size: 1.4rem;
  }
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const InProgress = styled.p`
  justify-self: center;
  align-self: center;
  text-align: center;
  font-size: 1.6rem;
  padding: 2% 1%;
  width: 140px;
  border: 1px solid #716d6d;
  color: #716d6d;
  box-sizing: border-box;
  border-radius: 5px;
  @media (max-width: 800px) {
    font-size: 1.4rem;
  }
`;

const Info = styled.div`
  background: rgba(50, 172, 102, 0.05);
  padding: 2% 4%;
  margin: 0 0 4% 0;
  width: 100%;
  @media (max-width: 800px) {
    padding: 2% 8%;
  }
`;

const ToggleQuestion = styled.div`
  /* The switch - the box around the slider */
  justify-self: center;
  align-self: center;
  .switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
  }

  /* Hide default HTML checkbox */
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  /* The slider */
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  input:checked + .slider {
    background-color: #092242;
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #092242;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }
`;

class LessonHeader extends Component {
  state = {
    published: this.props.lesson.published,
    reveal: false,
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({ [name]: value });
  };

  toggle = () => {
    this.setState((prev) => ({ reveal: !prev.reveal }));
  };

  render() {
    const {
      lesson,
      name,
      author,
      new_students,
      coursePageId,
      students,
      me,
    } = this.props;

    let tests = [];
    let quizes = [];
    let problems = [];
    let color;

    if (me) {
      let visits = lesson.lessonResults.filter((l) => l.student.id === me.id);
      // console.log(lesson.quizes, lesson.quizes.length > 0);
      if (lesson.quizes.length > 0) {
        lesson.quizes.map((l) => quizes.push(...l.quizResults));
      }
      quizes = quizes.filter((q) => q.student.id === me.id);
      if (lesson.newTests.length > 0) {
        lesson.newTests.map((l) => tests.push(...l.testResults));
      }
      tests = tests.filter((l) => l.student.id === me.id);
      if (lesson.problems.length > 0) {
        lesson.problems.map((l) => problems.push(...l.problemResults));
      }
      problems = problems.filter((l) => l.student.id === me.id);

      if (
        visits.length > 0 &&
        tests.length === 0 &&
        problems.length === 0 &&
        quizes.length === 0
      ) {
        color = "#FFD836";
      } else if (
        visits.length > 0 &&
        (tests.length > 0 || problems.length > 0 || quizes.length > 0)
      ) {
        color = "#32AC66";
      } else {
        color = "white";
      }
    } else {
      color = "white";
    }
    return (
      <>
        <TextBar color={color} open={lesson.open}>
          <Text>
            <div>
              {lesson.number}. {name}{" "}
              <span className="arrow" onClick={this.toggle}>
                {this.state.reveal ? `🔽` : `🔼`}
              </span>
            </div>
          </Text>
          <Buttons>
            {me && (me.id === author || me.permissions.includes("ADMIN")) ? (
              <>
                <Mutation
                  mutation={UPDATE_PUBLISHED_MUTATION}
                  variables={{
                    id: lesson.id,
                    published: !this.state.published,
                  }}
                  refetchQueries={() => [
                    {
                      query: SINGLE_COURSEPAGE_QUERY,
                      variables: { id: coursePageId },
                    },
                  ]}
                >
                  {(updatePublished, { loading, error }) => (
                    <ToggleQuestion>
                      <label className="switch">
                        <input
                          name="published"
                          type="checkbox"
                          checked={this.state.published}
                          onChange={async (e) => {
                            updatePublished();
                            this.handleInputChange(e);
                          }}
                        />
                        <span className="slider" />
                      </label>
                    </ToggleQuestion>
                  )}
                </Mutation>
              </>
            ) : null}
            {me && (
              <>
                <Mutation
                  mutation={CREATE_LESSONRESULT_MUTATION}
                  variables={{
                    lessonID: lesson.id,
                    visitsNumber: 1,
                  }}
                  refetchQueries={() => [
                    {
                      query: SINGLE_COURSEPAGE_QUERY,
                      variables: { id: coursePageId },
                    },
                  ]}
                >
                  {(createLessonResult, { loading, error }) => {
                    return (
                      <>
                        {lesson.lessonResults.filter(
                          (l) => l.student.id === me.id
                        ).length === 0 && (
                          <>
                            {me &&
                            lesson &&
                            (me.id === author ||
                              me.permissions.includes("ADMIN") ||
                              lesson.open) ? (
                              <Link
                                // The user is the teacher or the admin or it is an openLesson.
                                href={{
                                  pathname: "/lesson",
                                  query: {
                                    id: lesson.id,
                                    type: lesson.type.toLowerCase(),
                                  },
                                }}
                              >
                                <A>
                                  <Button
                                    onClick={() => {
                                      createLessonResult();
                                      console.log(0);
                                    }}
                                  >
                                    Перейти
                                  </Button>
                                </A>
                              </Link>
                            ) : null}

                            {me &&
                              lesson &&
                              me.id !== lesson.user.id &&
                              (students.includes(me.id) ||
                                new_students.includes(me.id)) &&
                              !me.permissions.includes("ADMIN") &&
                              !lesson.open &&
                              this.state.published && (
                                <Link
                                  // The user hasn't visited the lesson page before. Create the lesson visit node.
                                  href={{
                                    pathname: "/lesson",
                                    query: {
                                      id: lesson.id,
                                      type: lesson.type.toLowerCase(),
                                    },
                                  }}
                                >
                                  <A>
                                    <Button
                                      onClick={() => {
                                        createLessonResult();
                                        console.log(1);
                                      }}
                                    >
                                      Перейти
                                    </Button>
                                  </A>
                                </Link>
                              )}
                          </>
                        )}
                      </>
                    );
                  }}
                </Mutation>
                {lesson.lessonResults.filter((l) => l.student.id === me.id)
                  .length > 0 && (
                  <Mutation
                    mutation={UPDATE_LESSONRESULT_MUTATION}
                    variables={{
                      id: lesson.lessonResults[0].id,
                      visitsNumber: lesson.lessonResults[0].visitsNumber + 1,
                    }}
                    refetchQueries={() => [
                      {
                        query: SINGLE_COURSEPAGE_QUERY,
                        variables: { id: coursePageId },
                      },
                    ]}
                  >
                    {(updateLessonResult, { loading, error }) => {
                      return (
                        <>
                          {me &&
                          lesson &&
                          (me.id === author ||
                            me.permissions.includes("ADMIN") ||
                            lesson.open) ? (
                            <Link
                              // The user is the teacher or the admin or it is an openLesson.
                              href={{
                                pathname: "/lesson",
                                query: {
                                  id: lesson.id,
                                  type: lesson.type.toLowerCase(),
                                },
                              }}
                            >
                              <A>
                                <Button
                                  onClick={() => {
                                    updateLessonResult();
                                    console.log(3);
                                  }}
                                >
                                  Перейти
                                </Button>
                              </A>
                            </Link>
                          ) : null}

                          {me &&
                            lesson &&
                            me.id !== lesson.user.id &&
                            !me.permissions.includes("ADMIN") &&
                            (students.includes(me.id) ||
                              new_students.includes(me.id)) &&
                            this.state.published && (
                              <Link
                                // The user HAS visited the lesson page and we update it now
                                href={{
                                  pathname: "/lesson",
                                  query: {
                                    id: lesson.id,
                                    type: lesson.type.toLowerCase(),
                                  },
                                }}
                              >
                                <A>
                                  <Button
                                    onClick={() => {
                                      updateLessonResult();
                                      console.log(4);
                                    }}
                                  >
                                    Перейти
                                  </Button>
                                </A>
                              </Link>
                            )}
                        </>
                      );
                    }}
                  </Mutation>
                )}
              </>
            )}

            {me &&
            lesson &&
            me.id !== lesson.user.id &&
            (students.includes(me.id) || new_students.includes(me.id)) &&
            !me.permissions.includes("ADMIN") &&
            !this.state.published ? (
              <InProgress>В разработке</InProgress>
            ) : null}
          </Buttons>
        </TextBar>

        {lesson.description && this.state.reveal && (
          <Info>{renderHTML(lesson.description)}</Info>
        )}
      </>
    );
  }
}

export default LessonHeader;

// import React, { Component } from "react";
// import gql from "graphql-tag";
// import { Mutation, Query } from "@apollo/client/react/components";
// import styled from "styled-components";
// import Link from "next/link";
// import renderHTML from "react-render-html";
// import { SINGLE_COURSEPAGE_QUERY } from "../course/CoursePage";

// const UPDATE_PUBLISHED_MUTATION = gql`
//   mutation UPDATE_PUBLISHED_MUTATION($id: ID!, $published: Boolean) {
//     updatePublished(id: $id, published: $published) {
//       id
//       number
//       name
//       text
//     }
//   }
// `;

// const CREATE_LESSONRESULT_MUTATION = gql`
//   mutation CREATE_LESSONRESULT_MUTATION($visitsNumber: Int, $lessonID: ID) {
//     createLessonResult(visitsNumber: $visitsNumber, lessonID: $lessonID) {
//       id
//     }
//   }
// `;

// const UPDATE_LESSONRESULT_MUTATION = gql`
//   mutation UPDATE_LESSONRESULT_MUTATION($id: ID!, $visitsNumber: Int) {
//     updateLessonResult(id: $id, visitsNumber: $visitsNumber) {
//       id
//     }
//   }
// `;

// const TextBar = styled.div`
//   display: grid;
//   grid-template-columns: 65% 35%;
//   width: 100%;
//   font-size: 1.6rem;
//   margin-bottom: 15px;
//   border-left: 2px solid;
//   border-color: ${(props) => props.color};
//   padding-left: 2%;
//   span {
//     cursor: pointer;
//     &:hover {
//       color: red;
//     }
//   }
//   @media (max-width: 1000px) {
//     display: flex;
//     flex-direction: column;
//     justify-content: center;
//     padding: 0 3%;
//   }
// `;

// const A = styled.a`
//   justify-self: center;
//   align-self: center;
// `;

// const Text = styled.div`
//   display: flex;
//   flex-direction: row;
//   justify-content: space-between;
//   padding-right: 25px;
//   div {
//     padding: 2% 0% 2% 0%;
//   }
//   .arrow {
//     cursor: pointer;
//   }
// `;

// const Button = styled.button`
//   font-size: 1.6rem;
//   padding: 5%;
//   background: #ffffff;
//   border: 1px solid #112a62;
//   color: #112a62;
//   box-sizing: border-box;
//   border-radius: 5px;
//   width: 100px;
//   height: 40px;
//   cursor: pointer;
//   outline: 0;
//   @media (max-width: 800px) {
//     font-size: 1.4rem;
//   }
// `;

// const Buttons = styled.div`
//   display: flex;
//   flex-direction: row;
//   justify-content: space-between;
//   width: 100%;
// `;

// const InProgress = styled.p`
//   justify-self: center;
//   align-self: center;
//   text-align: center;
//   font-size: 1.6rem;
//   padding: 2% 1%;
//   width: 140px;
//   border: 1px solid #716d6d;
//   color: #716d6d;
//   box-sizing: border-box;
//   border-radius: 5px;
//   @media (max-width: 800px) {
//     font-size: 1.4rem;
//   }
// `;

// const Info = styled.div`
//   background: rgba(50, 172, 102, 0.05);
//   padding: 2% 4%;
//   margin: 0 0 4% 0;
//   width: 100%;
//   @media (max-width: 800px) {
//     padding: 2% 8%;
//   }
// `;

// const ToggleQuestion = styled.div`
//   /* The switch - the box around the slider */
//   justify-self: center;
//   align-self: center;
//   .switch {
//     position: relative;
//     display: inline-block;
//     width: 60px;
//     height: 34px;
//   }

//   /* Hide default HTML checkbox */
//   .switch input {
//     opacity: 0;
//     width: 0;
//     height: 0;
//   }

//   /* The slider */
//   .slider {
//     position: absolute;
//     cursor: pointer;
//     top: 0;
//     left: 0;
//     right: 0;
//     bottom: 0;
//     background-color: #ccc;
//     -webkit-transition: 0.4s;
//     transition: 0.4s;
//   }

//   .slider:before {
//     position: absolute;
//     content: "";
//     height: 26px;
//     width: 26px;
//     left: 4px;
//     bottom: 4px;
//     background-color: white;
//     -webkit-transition: 0.4s;
//     transition: 0.4s;
//   }

//   input:checked + .slider {
//     background-color: #092242;
//   }

//   input:focus + .slider {
//     box-shadow: 0 0 1px #092242;
//   }

//   input:checked + .slider:before {
//     -webkit-transform: translateX(26px);
//     -ms-transform: translateX(26px);
//     transform: translateX(26px);
//   }
// `;

// class LessonHeader extends Component {
//   state = {
//     published: this.props.lesson.published,
//     reveal: false,
//     info: `
//     <p>Привет!</p>
//     <p>В уроке разбираются, такие вопросы, как ...</p>
//     <p>Вы научитесь, считать, писать или читать!</p>
//     <p>Обязателен для тех, кто хочет получить отметку 5.</p>`,
//   };

//   handleInputChange = (event) => {
//     const target = event.target;
//     const value = target.type === "checkbox" ? target.checked : target.value;
//     const name = target.name;

//     this.setState({ [name]: value });
//   };

//   toggle = () => {
//     this.setState((prev) => ({ reveal: !prev.reveal }));
//   };

//   render() {
//     const { lesson, name, new_students, students, me, openLesson } = this.props;
// let tests = [];
// let quizes = [];
// let problems = [];
// let color;

// if (me) {
//   let visits = lesson.lessonResults.filter((l) => l.student.id === me.id);
//   // console.log(lesson.quizes, lesson.quizes.length > 0);
//   if (lesson.quizes.length > 0) {
//     lesson.quizes.map((l) => quizes.push(...l.quizResults));
//   }
//   quizes = quizes.filter((q) => q.student.id === me.id);
//   if (lesson.newTests.length > 0) {
//     lesson.newTests.map((l) => tests.push(...l.testResults));
//   }
//   tests = tests.filter((l) => l.student.id === me.id);
//   if (lesson.problems.length > 0) {
//     lesson.problems.map((l) => problems.push(...l.problemResults));
//   }
//   problems = problems.filter((l) => l.student.id === me.id);

//   if (
//     visits.length > 0 &&
//     tests.length === 0 &&
//     problems.length === 0 &&
//     quizes.length === 0
//   ) {
//     color = "#FFD836";
//   } else if (
//     visits.length > 0 &&
//     (tests.length > 0 || problems.length > 0 || quizes.length > 0)
//   ) {
//     color = "#32AC66";
//   } else {
//     color = "white";
//   }
// } else {
//   color = "white";
// }

//     return (
//       <>
//         <TextBar color={color}>
//           <Text>
//             <div>
//               {lesson.number}. {name}{" "}
//               <span className="arrow" onClick={this.toggle}>
//                 {this.state.reveal ? `🔼` : `🔽`}
//               </span>
//             </div>
//           </Text>
//           <Buttons>
//             {me &&
//             (me.id === lesson.user.id || me.permissions.includes("ADMIN")) ? (
//               <>
//                 <Mutation
//                   mutation={UPDATE_PUBLISHED_MUTATION}
//                   variables={{
//                     id: lesson.id,
//                     published: !this.state.published,
//                   }}
//                   refetchQueries={() => [
//                     {
//                       query: SINGLE_COURSEPAGE_QUERY,
//                       variables: { id: lesson.coursePage.id },
//                     },
//                   ]}
//                 >
//                   {(updatePublished, { loading, error }) => (
//                     <ToggleQuestion>
//                       <label className="switch">
//                         <input
//                           name="published"
//                           type="checkbox"
//                           checked={this.state.published}
//                           onChange={async (e) => {
//                             updatePublished();
//                             this.handleInputChange(e);
//                           }}
//                         />
//                         <span className="slider" />
//                       </label>
//                     </ToggleQuestion>
//                   )}
//                 </Mutation>
//               </>
//             ) : null}
//             {me && (
//               <>
//                 <Mutation
//                   mutation={CREATE_LESSONRESULT_MUTATION}
//                   variables={{
//                     lessonID: lesson.id,
//                     visitsNumber: 1,
//                   }}
//                   // refetchQueries={() => [
//                   //   {
//                   //     query: SINGLE_COURSEPAGE_QUERY,
//                   //     variables: { id: lesson.coursePage.id }
//                   //   }
//                   // ]}
//                 >
//                   {(createLessonResult, { loading, error }) => {
//                     return (
//                       <>
//                         {lesson.lessonResults.filter(
//                           (l) => l.student.id === me.id
//                         ).length === 0 && (
//                           <>
//                             {me &&
//                             lesson &&
//                             (me.id === lesson.user.id ||
//                               me.permissions.includes("ADMIN") ||
//                               lesson.id === openLesson) &&
//                             (!students.includes(me.id) ||
//                               !new_students.includes(me.id)) ? (
//                               <Link
//                                 // The user is the teacher or the admin or it is an openLesson.
//                                 href={{
//                                   pathname: "/lesson",
//                                   query: {
//                                     id: lesson.id,
//                                     type: lesson.type.toLowerCase(),
//                                   },
//                                 }}
//                               >
//                                 <A>
//                                   <Button
//                                     onClick={() => {
//                                       createLessonResult();
//                                       console.log(0);
//                                     }}
//                                   >
//                                     Перейти
//                                   </Button>
//                                 </A>
//                               </Link>
//                             ) : null}

//                             {me &&
//                               lesson &&
//                               me.id !== lesson.user.id &&
//                               (students.includes(me.id) ||
//                                 new_students.includes(me.id)) &&
//                               !me.permissions.includes("ADMIN") &&
//                               this.state.published && (
//                                 <Link
//                                   // The user hasn't visited the lesson page before. Create the lesson visit node.
//                                   href={{
//                                     pathname: "/lesson",
//                                     query: {
//                                       id: lesson.id,
//                                       type: lesson.type.toLowerCase(),
//                                     },
//                                   }}
//                                 >
//                                   <A>
//                                     <Button
//                                       onClick={() => {
//                                         createLessonResult();
//                                         console.log(1);
//                                       }}
//                                     >
//                                       Перейти
//                                     </Button>
//                                   </A>
//                                 </Link>
//                               )}
//                           </>
//                         )}
//                       </>
//                     );
//                   }}
//                 </Mutation>
//                 {lesson.lessonResults.filter((l) => l.student.id === me.id)
//                   .length > 0 && (
//                   <Mutation
//                     mutation={UPDATE_LESSONRESULT_MUTATION}
//                     variables={{
//                       id: lesson.lessonResults[0].id,
//                       visitsNumber: lesson.lessonResults[0].visitsNumber + 1,
//                     }}
//                     // refetchQueries={() => [
//                     //   {
//                     //     query: SINGLE_COURSEPAGE_QUERY,
//                     //     variables: { id: lesson.coursePage.id }
//                     //   }
//                     // ]}
//                   >
//                     {(updateLessonResult, { loading, error }) => {
//                       return (
//                         <>
//                           {me &&
//                           lesson &&
//                           (me.id === lesson.user.id ||
//                             me.permissions.includes("ADMIN") ||
//                             lesson.id === openLesson) &&
//                           (!students.includes(me.id) ||
//                             !new_students.includes(me.id)) ? (
//                             <Link
//                               // The teacher or the admin visit the lesson page for the second time. We do not update anything.
//                               href={{
//                                 pathname: "/lesson",
//                                 query: {
//                                   id: lesson.id,
//                                   type: lesson.type.toLowerCase(),
//                                 },
//                               }}
//                             >
//                               <A>
//                                 <Button
//                                   onClick={() => {
//                                     updateLessonResult();
//                                     console.log(3, lesson.lessonResults);
//                                   }}
//                                 >
//                                   Перейти
//                                 </Button>
//                               </A>
//                             </Link>
//                           ) : null}

//                           {me &&
//                             lesson &&
//                             me.id !== lesson.user.id &&
//                             !me.permissions.includes("ADMIN") &&
//                             (students.includes(me.id) ||
//                               new_students.includes(me.id)) &&
//                             this.state.published && (
//                               <Link
//                                 // The user HAS visited the lesson page and we update it now
//                                 href={{
//                                   pathname: "/lesson",
//                                   query: {
//                                     id: lesson.id,
//                                     type: lesson.type.toLowerCase(),
//                                   },
//                                 }}
//                               >
//                                 <A>
//                                   <Button
//                                     onClick={() => {
//                                       updateLessonResult();
//                                       console.log(4);
//                                     }}
//                                   >
//                                     Перейти
//                                   </Button>
//                                 </A>
//                               </Link>
//                             )}
//                         </>
//                       );
//                     }}
//                   </Mutation>
//                 )}
//               </>
//             )}

//             {me &&
//             lesson &&
//             me.id !== lesson.user.id &&
//             (students.includes(me.id) || new_students.includes(me.id)) &&
//             !me.permissions.includes("ADMIN") &&
//             !this.state.published ? (
//               <InProgress>Закрыт</InProgress>
//             ) : null}
//           </Buttons>
//         </TextBar>

//         {lesson.description && this.state.reveal && (
//           <Info>{renderHTML(lesson.description)}</Info>
//         )}
//       </>
//     );
//   }
// }

// export default LessonHeader;
