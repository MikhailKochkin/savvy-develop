import React, { Component } from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import styled from "styled-components";
import Note from "./notes/Note";
import Shots from "./shots/Shots";
import SingleTest from "./tests/SingleTest";
import SingleQuiz from "./quizes/SingleQuiz";
import SingleProblem from "./problems/SingleProblem";
import SingleTextEditor from "./textEditors/SingleTextEditor";
import SingleConstructor from "./constructions/SingleConstructor";
import Forum from "./forum/Forum";
import Document from "./documents/Document";
import Exam from "./exams/Exam";
import Feed from "./Feed";

const Container = styled.div`
  /* font-size: 1.8rem; */
  .fade-enter {
    opacity: 0.01;
  }

  .fade-enter.fade-enter-active {
    opacity: 1;
    transition: opacity 500ms ease-in;
  }

  .fade-leave {
    opacity: 1;
  }

  .fade-leave.fade-leave-active {
    opacity: 0.01;
    transition: opacity 10ms ease-in;
  }
`;

class StoryEx extends Component {
  render() {
    const { tasks, me, lesson, num } = this.props;
    let components = [];
    tasks.map((task) => {
      let el;
      let item;
      if (task.type === "Note") {
        el = lesson.notes.find((note) => note.id === task.id);
        item = <Note text={el.text} me={me} story={true} note={el} />;
        components.push(item);
      } else if (task.type === "NewTest") {
        el = lesson.newTests.find((test) => test.id === task.id);
        console.log(lesson.testResults);
        item = (
          <SingleTest
            key={el.id}
            id={el.id}
            question={el.question}
            answers={el.answers}
            true={el.correct}
            user={el.user.id}
            type={el.type}
            me={me}
            userData={lesson.testResults}
            lessonID={lesson.id}
            length={Array(el.correct.length).fill(false)}
            userData={lesson.testResults}
            story={true}
          />
        );
        components.push(item);
      } else if (task.type === "Quiz") {
        el = lesson.quizes.find((quiz) => quiz.id === task.id);
        item = (
          <SingleQuiz
            id={el.id}
            key={el.id}
            question={el.question}
            answer={el.answer}
            me={me}
            type={el.type}
            hidden={true}
            userData={lesson.quizResults}
            lessonID={lesson.id}
            quizID={el.id}
            user={el.user.id}
            story={true}
          />
        );
        components.push(item);
      } else if (task.type === "Shot") {
        el = lesson.shots.find((shot) => shot.id === task.id);
        item = (
          <Shots
            id={el.id}
            key={el.id}
            comments={el.comments}
            parts={el.parts}
            shotUser={el.user.id}
            me={me}
            shotID={el.id}
            lessonID={lesson.id}
            title={el.title}
            userData={lesson.shotResults}
            story={true}
          />
        );
        components.push(item);
      } else if (task.type === "Problem") {
        el = lesson.problems.find((problem) => problem.id === task.id);
        item = (
          <SingleProblem
            id={el.id}
            key={el.id}
            problem={el}
            lessonID={lesson.id}
            me={me}
            userData={lesson.problemResults}
            story={true}
            lesson={lesson}
          />
        );
        components.push(item);
      } else if (task.type === "TextEditor") {
        el = lesson.texteditors.find((texteditor) => texteditor.id === task.id);
        item = (
          <SingleTextEditor
            id={el.id}
            key={el.id}
            lesson={lesson.id}
            textEditor={el}
            me={me}
            userData={lesson.textEditorResults}
            story={true}
          />
        );
        components.push(item);
      } else if (task.type === "Construction") {
        el = lesson.constructions.find((con) => con.id === task.id);
        item = (
          <SingleConstructor
            id={el.id}
            key={el.id}
            lessonID={lesson.id}
            construction={el}
            variants={el.variants}
            me={me}
            arr={Array(el.answer.length).fill("")}
            userData={lesson.constructionResults}
            story={true}
          />
        );
        components.push(item);
      } else if (task.type === "Exam") {
        el = lesson.exams.find((con) => con.id === task.id);
        item = (
          <Exam lesson={lesson} me={this.props.me} exam={el} story={true} />
        );
        components.push(item);
      } else if (task.type === "Document") {
        el = lesson.documents.find((con) => con.id === task.id);
        item = (
          <Document
            id={el.id}
            key={el.id}
            clauses={el.clauses}
            title={el.title}
            me={me}
            documentID={el.id}
            user={lesson.user.id}
            lessonID={lesson.id}
            // userData={lesson.documentResults}
            story={true}
          />
        );
        components.push(item);
      } else if (task.type === "Forum") {
        el = lesson.forum;
        item = (
          <Forum
            key={el.id}
            text={el.text}
            forum={el}
            me={me}
            id={el.id}
            lesson={lesson.id}
            result={el.rating.filter((r) => r.user.id == me.id)[0]}
            statements={el.statements}
          />
        );
        components.push(item);
      }
    });
    return (
      <Container>
        <ReactCSSTransitionGroup
          transitionName="fade"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={10}
        >
          <Feed components={components} num={num} />
        </ReactCSSTransitionGroup>
      </Container>
    );
  }
}

export default StoryEx;
