import React, { Component } from "react";
import SingleQuiz from "./SingleQuiz";
import styled from "styled-components";

const Styles = styled.div`
  margin-top: 5%;
`;

class QuizGroup extends Component {
  state = {
    tests: this.props.quizes,
    completed: 0,
    handIn: false,
    data: [this.props.quizes]
  };

  myCallback = () => {
    this.setState(prevState => ({ completed: prevState.completed + 1 }));
  };

  updateArray = data => {
    const newQuiz = this.props.quizes.filter(
      q => q.id === Object.values(data)[0]
    )[0];
    this.setState(state => {
      const data = [...state.data, newQuiz];
      return {
        data
      };
    });
  };

  render() {
    return (
      <Styles>
        {this.props.quizes.map((quiz, index) => (
          <>
            <SingleQuiz
              id={quiz.id}
              question={quiz.question}
              answer={quiz.answer}
              type={quiz.type}
              num={index + 1}
              getQuizData={this.myCallback}
              me={this.props.me}
              lessonID={this.props.lessonID}
              quizID={quiz.id}
              ifRight={quiz.ifRight}
              ifWrong={quiz.ifWrong}
              user={quiz.user.id}
              userData={this.props.quizResults}
              quizes={this.props.quizes}
              notes={this.props.notes}
              tests={this.props.tests}
              notes={this.props.notes}
              next={quiz.next}
              getData={this.updateArray}
            />
            <hr />
          </>
        ))}
      </Styles>
    );
  }
}

export default QuizGroup;
