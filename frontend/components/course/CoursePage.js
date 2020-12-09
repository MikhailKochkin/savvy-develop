import React, { useState } from "react";
import { Query } from "@apollo/client/react/components";
import gql from "graphql-tag";
import styled from "styled-components";
import renderHTML from "react-render-html";
import LessonHeader from "../lesson/LessonHeader";
import { useUser } from "../User";
import FirstLesson from "./coursePageCards/FirstLesson";
import RegisterCard from "./coursePageCards/RegisterCard";
import StudentCard from "./coursePageCards/StudentCard";
import TeacherCard from "./coursePageCards/TeacherCard";
import SignInCard from "./coursePageCards/SignInCard";
import Loading from "../Loading";
import Feedback from "./Feedback";

const SINGLE_COURSEPAGE_QUERY = gql`
  query SINGLE_COURSEPAGE_QUERY($id: String!) {
    coursePage(where: { id: $id }) {
      id
      title
      image
      news
      price
      discountPrice
      video
      audience
      result
      tags
      tariffs
      methods
      reviews
      promocode
      published
      user {
        id
      }
      lessons {
        id
        name
        number
        type
        open
        structure
        description
        published
        coursePage {
          id
        }
        user {
          id
        }
        lessonResults {
          id
          visitsNumber
          lessonID
          student {
            id
          }
        }
      }
      description
      courseType
      students
      applications {
        id
        applicantId
      }
      new_students {
        id
      }
      user {
        id
        name
        surname
        description
        status
        uni {
          id
          title
        }
        company {
          id
          name
        }
      }
    }
  }
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LessonStyles = styled.div`
  max-width: 850px;
  min-width: 700px;
  margin: 1.5% 0;
  @media (max-width: 1000px) {
    width: 90%;
    min-width: 100px;
  }
`;

const CourseInfo = styled.div`
  display: flex;
  flex-direction: row;
  @media (max-width: 1000px) {
    flex-direction: column;
  }
`;

const LessonsInfo = styled.div`
  margin-top: 2%;
  padding: 0 3%;
  .week {
    font-size: 1.6rem;
    font-weight: bold;
    margin: 1% 0;
    margin-top: 3%;
  }
`;

const Data = styled.div`
  flex: 60%;
  padding: 2% 3%;
  p {
    margin: 0;
  }
  .name {
    font-size: 1.6rem;
    font-weight: bold;
    padding-bottom: 4%;
    padding-top: 4%;
    border-top: 1px solid #e4e4e4;
  }
  .company {
    font-size: 1.6rem;
    padding-bottom: 4%;
  }
  .track {
    font-size: 1.6rem;
    line-height: 1.4;
    padding-top: 4%;
    padding-bottom: 4%;
  }
  .track2 {
    font-size: 1.6rem;
    line-height: 1.4;
    padding-top: 0%;
    padding-bottom: 4%;
  }
  .trackName {
    font-weight: 600;
  }
`;

const PayBox = styled.div`
  flex: 40%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  padding: 2% 3%;
  @media (max-width: 1000px) {
    margin-bottom: 20px;
    align-items: center;
  }
`;

const LessonImage = styled.img`
  position: relative;
  object-fit: cover;
  height: 350px;
  width: 100%;
  @media (max-width: 800px) {
    height: 200px;
  }
`;

const Header = styled.div`
  font-size: 2.4rem;
  padding-bottom: 4%;
  padding-top: 4%;
  line-height: 1.4;
`;

const Total = styled.div`
  font-size: 1.6rem;
  margin: 1.5% 0;
`;

const Buttons = styled.div``;

const Button = styled.button`
  border: none;
  background: none;
  font-size: 1.6rem;
  padding: 0;
  margin-right: 20px;
  outline: 0;
  cursor: pointer;
  font-family: Montserrat;
  padding-bottom: 10px;
  border-bottom: ${(props) =>
    props.primary ? "1px solid black" : "1px solid white"};
`;

const SignInButton = styled.button`
  background: #0846d8;
  border-radius: 5px;
  width: 20%;
  height: 38px;
  outline: 0;
  color: white;
  font-weight: 600;
  font-size: 1.4rem;
  outline: none;
  cursor: pointer;
  border: none;
  margin-top: 10px;
  &:hover {
    background: rgba(8, 70, 216, 0.85);
  }
  &:active {
    background-color: ${(props) => props.theme.darkGreen};
  }
  &:disabled {
    &:hover {
      background-color: #84bc9c;
    }
  }
  @media (max-width: 800px) {
    width: 50%;
  }
`;

const Details = styled.div`
  margin: 3% 0;
  padding: 0 2%;
  font-size: 1.6rem;
  .yellow {
    padding: 4%;
    background: rgba(169, 210, 255, 0.3);
    margin-top: 2%;
    width: 100%;
    @media (max-width: 800px) {
      padding: 20px;
    }
  }
  .green {
    padding: 4%;
    background: rgba(210, 246, 252, 0.3);
    width: 100%;
    @media (max-width: 800px) {
      padding: 20px;
    }
  }
  .blue {
    padding: 4%;
    background: rgba(121, 132, 238, 0.15);
    margin-bottom: 4%;
    width: 100%;
    @media (max-width: 800px) {
      padding: 20px;
    }
  }
  .header {
    font-size: 1.8rem;
    font-weight: bold;
    margin-bottom: 1%;
    @media (max-width: 800px) {
      font-size: 1.6rem;
    }
  }
  .openLesson {
    margin: 3% 0;
    @media (max-width: 800px) {
      margin: 6% 0;
    }
  }
`;

const Video = styled.div`
  .header {
    margin-bottom: 3%;
  }
  margin: 3% 0;
  iframe {
    width: 100%;
    height: 45vh;
    border: none;
  }
`;

const Comment = styled.div`
  font-size: 1.6rem;
  background: #0268e6;
  color: white;
  padding: 2% 3%;
  margin-top: 3%;
  text-align: center;
`;

const CoursePage = (props) => {
  const [page, setPage] = useState("lessons");

  const scroll = () => {
    window.scrollTo(0, 0);
  };
  const me = useUser();
  return (
    <>
      <div id="root"></div>
      <>
        <Query
          query={SINGLE_COURSEPAGE_QUERY}
          variables={{
            id: props.id,
          }}
        >
          {({ error, loading, data }) => {
            if (error) return <Error error={error} />;
            if (loading) return <Loading />;
            const coursePage = data.coursePage;
            let lessons = coursePage.lessons;
            const student_list = [];
            coursePage.new_students.map((ns) => student_list.push(ns.id));
            let price;
            if (coursePage.price === null) {
              price = "Бесплатно";
            } else {
              price = coursePage.price;
            }
            const studentsArray = [];
            coursePage.students.map((student) => studentsArray.push(student));
            console.log(me);
            const new_subjectArray = [];
            // me &&
            //   me.new_subjects.map((new_subject) =>
            //     new_subjectArray.push(new_subject.id)
            //   );

            const applicationsList = [];
            coursePage.applications.map((application) =>
              applicationsList.push(application.applicantId)
            );

            let lessonsList = [];
            coursePage.lessons.map((l) => lessonsList.push(l.id));

            const openLesson = coursePage.lessons.filter(
              (c) => c.id === coursePage.openLesson
            );
            return (
              <>
                <Container>
                  <LessonImage
                    src={
                      "https://cdn.pixabay.com/photo/2016/05/24/16/48/mountains-1412683_1280.png"
                    }
                  />
                  <LessonStyles>
                    <CourseInfo>
                      <Data>
                        <Header>{coursePage.title}</Header>
                        <p className="track2">{coursePage.description}</p>
                        <p className="track2">{coursePage.user.description}</p>
                      </Data>
                      <PayBox>
                        {/* Карточка регистрации на сайте */}
                        {!me && <SignInCard />}
                        {/* Карточка первого урока */}
                        {me &&
                          me.id !== coursePage.user.id &&
                          !new_subjectArray.includes(coursePage.id) &&
                          !me.permissions.includes("ADMIN") && (
                            <FirstLesson lesson={openLesson} />
                          )}
                        {/* Карточка преподавателя */}
                        {me &&
                          (me.id === coursePage.user.id ||
                            me.permissions.includes("ADMIN")) && (
                            <TeacherCard
                              id={coursePage.id}
                              coursePage={coursePage}
                            />
                          )}
                        {/* Карточка ученика */}
                        {me &&
                          new_subjectArray.includes(coursePage.id) &&
                          !me.permissions.includes("ADMIN") && (
                            <StudentCard coursePage={coursePage} me={me} />
                          )}
                      </PayBox>
                    </CourseInfo>
                    <Details>
                      {data.coursePage.audience && (
                        <div className="yellow">
                          <div className="header">
                            🙋🏻‍♀ Кому нужен этот курс?
                          </div>
                          <div>{renderHTML(data.coursePage.audience)}</div>
                        </div>
                      )}
                      {data.coursePage.video && data.coursePage.video !== "" && (
                        <Video>
                          <div className="header">
                            Посмотрите презентацию курса от его автора:
                          </div>
                          <iframe src={data.coursePage.video} allowFullScreen />
                        </Video>
                      )}
                      {data.coursePage.methods && (
                        <div className="green">
                          <div className="header">
                            👨🏻‍🏫 👩🏼‍🏫 Об авторе курса и его подходах
                          </div>
                          <div>{renderHTML(data.coursePage.methods)}</div>
                        </div>
                      )}
                      {openLesson.length > 0 && (
                        <div className="openLesson">
                          <div className="header">
                            Посмотрите первый открытый урок уже сейчас!
                          </div>
                          {!me && (
                            <>
                              <p>
                                Войдите или зарегистрируйтесь, чтобы это
                                сделать.
                              </p>
                              <SignInButton onClick={(e) => scroll()}>
                                Войти
                              </SignInButton>
                            </>
                          )}
                          {me &&
                            openLesson.map((lesson, index) => (
                              <LessonHeader
                                me={me}
                                key={lesson.id}
                                name={lesson.name}
                                lesson={lesson}
                                coursePage={props.id}
                                author={coursePage.user.id}
                                students={coursePage.students}
                                new_students={student_list}
                                index={index + 1}
                                coursePageId={coursePage.id}
                              />
                            ))}
                        </div>
                      )}
                      {data.coursePage.result && (
                        <div className="blue">
                          <div className="header">
                            🎁 Что вы получите в результате прохождения курса?
                          </div>
                          <div>{renderHTML(data.coursePage.result)}</div>
                        </div>
                      )}
                    </Details>
                    <LessonsInfo>
                      <Buttons>
                        <Button
                          primary={page === "lessons"}
                          onClick={(e) => setPage("lessons")}
                        >
                          Уроки
                        </Button>
                        <Button
                          primary={page === "feedback"}
                          onClick={(e) => setPage("forum")}
                        >
                          Обратная связь
                        </Button>
                      </Buttons>
                      {page === "lessons" && (
                        <>
                          <Total>Всего: {lessons.length}</Total>
                          {lessons
                            // .sort((a, b) =>
                            //   a.number > b.number ? 1 : -1
                            // )
                            .map((lesson, index) => (
                              <>
                                {(index + 3) % 3 === 0 && (
                                  <div className="week">
                                    Неделя {(index + 3) / 3}
                                  </div>
                                )}
                                <LessonHeader
                                  me={me}
                                  key={lesson.id}
                                  name={lesson.name}
                                  lesson={lesson}
                                  coursePage={props.id}
                                  author={coursePage.user.id}
                                  // students={coursePage.students}
                                  openLesson={coursePage.openLesson}
                                  new_students={student_list}
                                  open={index + 1 === 1}
                                  index={index + 1}
                                />
                              </>
                            ))}
                        </>
                      )}

                      {/* {this.state.page === "forum" &&
                                    new_subjectArray.includes(coursePage.id) ? (
                                      me && (
                                        <>
                                          <Forum
                                            coursePage={coursePage}
                                            me={me}
                                          />
                                        </>
                                      )
                                    ) : (
                                      <Comment>
                                        Зарегистрируйтесь на курс, чтобы
                                        получить доступ к форуму.
                                      </Comment>
                                    ))} */}

                      {page === "feedback" &&
                        (me && new_subjectArray.includes(coursePage.id) ? (
                          <>
                            {me.studentFeedback.filter((feed) =>
                              lessonsList.includes(feed.lesson.id)
                            ).length === 0 ? (
                              <p>Обратной связи нет</p>
                            ) : null}
                            {me.studentFeedback
                              .filter((feed) =>
                                lessonsList.includes(feed.lesson.id)
                              )
                              .map((feedback) => (
                                <Feedback feedback={feedback} />
                              ))}
                          </>
                        ) : (
                          <Comment>
                            Зарегистрируйтесь на курс по продвинутому тарифу,
                            чтобы получать обратную связь по выполненным
                            заданиям.
                          </Comment>
                        ))}
                      {/* {this.state.page === "finals" && (
                                    <>
                                      {me &&
                                        (me.id === coursePage.user.id ||
                                          me.permissions.includes("ADMIN")) &&
                                        (coursePage.examQuestion ? (
                                          <UpdateExamQuestion
                                            id={this.props.id}
                                          />
                                        ) : (
                                          <ExamQuestion id={this.props.id} />
                                        ))}
                                      {me &&
                                        me.id !== coursePage.user.id &&
                                        !me.permissions.includes("ADMIN") &&
                                        (coursePage.examQuestion ? (
                                          <ExamAnswer
                                            id={this.props.id}
                                            question={coursePage.examQuestion}
                                          />
                                        ) : (
                                          <p>
                                            На этом курсе пока нет финального
                                            задания
                                          </p>
                                        ))}
                                    </>
                                  )} */}
                    </LessonsInfo>
                    <Details>
                      {data.coursePage.tariffs && (
                        <div className="yellow">
                          <div className="header">
                            📚Как проходит обучение на разных тарифах?
                          </div>
                          <div>{renderHTML(data.coursePage.tariffs)}</div>
                        </div>
                      )}
                    </Details>
                    {/* {(
                      !new_subjectArray.includes(coursePage.id)) && (
                      <RegisterCard
                        me={me}
                        coursePage={coursePage}
                        price={price}
                        discountPrice={coursePage.discountPrice}
                        promocode={coursePage.promocode}
                        studentsArray={studentsArray}
                      />
                    )} */}
                    {/* {data.coursePage.reviews.length > 0 && ( */}
                    {/* <Reviews>
                                  {coursePage.reviews.map((post) => (
                                    <div>
                                      <a
                                        href={post.comment_src}
                                        target="_blank"
                                      >
                                        <img src={post.img_src} />
                                      </a>
                                    </div>
                                  ))}
                                </Reviews> */}
                    {/* )} */}
                  </LessonStyles>
                </Container>
              </>
            );
          }}
        </Query>
      </>
    </>
  );
};

export default CoursePage;
export { SINGLE_COURSEPAGE_QUERY };
