import React, { Component } from "react";
import { Mutation } from "@apollo/client/react/components";
import gql from "graphql-tag";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import DeleteSingleQuiz from "../../delete/DeleteSingleQuiz";
import UpdateQuiz from "./UpdateQuiz";
import { CURRENT_USER_QUERY } from "../../User";

const CREATE_QUIZRESULT_MUTATION = gql`
  mutation CREATE_QUIZRESULT_MUTATION(
    $answer: String
    $quiz: ID
    $lessonID: ID
    $correct: Boolean
  ) {
    createQuizResult(
      answer: $answer
      quiz: $quiz
      lessonID: $lessonID
      correct: $correct
    ) {
      id
    }
  }
`;

const Styles = styled.div`
  display: flex;
  flex-direction: column;
  width: ${(props) => (props.story ? "100%" : "95%")};
  margin-bottom: 3%;
  font-size: 1.8rem;
  @media (max-width: 800px) {
    flex-direction: column;
  }
`;

const Question = styled.div`
  display: flex;
  flex-direction: column;
  flex: 50%;
  margin-bottom: 3%;
  margin-top: ${(props) => (props.story ? "2%" : "0%")};
  button {
    width: 30%;
    padding: 2%;
    margin-top: 5%;
  }
  @media (max-width: 800px) {
    padding: 0%;
    margin-bottom: 5%;
    button {
      width: 50%;
      padding: 3%;
    }
  }
`;

const Textarea = styled.textarea`
  height: 150px;
  width: 100%;
  border: 1px solid #c4c4c4;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  outline: 0;
  font-family: Montserrat;
  padding: 2%;
  font-size: 1.6rem;
  margin-top: 3%;
  @media (max-width: 800px) {
    width: 100%;
    height: 100px;
  }
`;

const Answer = styled.div`
  border: 1px solid #84bc9c;
  border-radius: 5px;
  width: 100%;
  color: black;
  padding: 2%;
  min-height: 150px;
  display: ${(props) => (props.display === "true" ? "none" : "block")};
  margin-bottom: 3%;
  @media (max-width: 800px) {
    width: 100%;
    height: 100px;
  }
`;

const Group = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 3%;
  div {
    border: 1px solid #c4c4c4;
    border-radius: 5px;
    padding: 0.5%;
    cursor: pointer;
  }
  #but2 {
    width: 45%;
    font-size: 1.6rem;
    text-align: center;
    &:hover {
      -webkit-box-shadow: 0 3px 4px rgba(0, 0, 0, 0.1);
      -moz-box-shadow: 0 3px 4px rgba(0, 0, 0, 0.1);
      box-shadow: 0 3px 4px rgba(0, 0, 0, 0.1);
    }
  }
`;

const Button1 = styled.div`
  width: 45%;
  background: ${(props) => props.inputColor};
  text-align: center;
  font-size: 1.6rem;
  &:hover {
    -webkit-box-shadow: 0 3px 4px rgba(0, 0, 0, 0.1);
    -moz-box-shadow: 0 3px 4px rgba(0, 0, 0, 0.1);
    box-shadow: 0 3px 4px rgba(0, 0, 0, 0.1);
  }
`;

const Dots = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  height: 90px;
  .group {
    display: flex;
    flex-direction: column;
    align-items: space-between;
    justify-content: space-between;
    margin-top: 5%;
  }
  .dot {
    width: 12px;
    height: 12px;
    background: #c4c4c4;
    border-radius: 50%;
  }
`;

const Progress = styled.div`
  display: ${(props) => (props.display === "true" ? "flex" : "none")};
  flex-direction: row;
  justify-content: center;
  width: 100%;
  margin: 0 0 2% 0;
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
`;

const StyledButton = withStyles({
  root: {
    margin: "4% 0",
    marginRight: "2%",
    fontSize: "1.6rem",
    textTransform: "none",
  },
})(Button);

const Block = styled.div`
  display: ${(props) => (props.display === "true" ? "block" : "none")};
  #comment {
    margin-bottom: 2%;
  }
`;

class SingleQuiz extends Component {
  state = {
    hidden: true,
    testFormat: false,
    answer: "",
    correct: "",
    inputColor: "none",
    update: false,
    sent: false,
    move: false,
    progress: "false",
  };

  onShow = (e) => {
    if (this.state.correct !== "") {
      this.setState((prevState) => ({ hidden: !prevState.hidden }));
    } else {
      alert("Сначала дайте свой ответ!");
    }
  };

  onSend = async () => {
    document.querySelector(".button").disabled = true;
  };

  onAnswer = async (e) => {
    this.setState({ progress: "true" });
    let data1 = {
      sentence1: this.props.answer.toLowerCase(),
      sentence2: this.state.answer.toLowerCase(),
    };
    const r = await fetch("https://dry-plains-91452.herokuapp.com/", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data1),
    })
      .then((response) => response.json())
      .then((res) => {
        console.log(res);
        if (res > 0.59) {
          this.setState({
            correct: "true",
            inputColor: "rgba(50, 172, 102, 0.25)",
          });
          this.move("true");
        } else {
          this.setState({
            correct: "false",
            inputColor: "rgba(222, 107, 72, 0.5)",
          });
          this.move("false");
        }
      })
      .catch((err) => console.log(err));
    this.setState({ progress: "false" });
  };

  move = (result) => {
    // 1. if the data is sent for the first time
    if (!this.state.sent) {
      // 2. and if we get the right answer
      if (result === "true" && this.props.getData) {
        // 3. and if this quiz is a part of an exam
        this.props.getData(
          this.props.next
            ? [true, this.props.next.true]
            : [true, { finish: "finish" }],
          "true"
        );
      }
      // 2. and if we get the wrong answer
      else if (result === "false") {
        // 3. and if this quiz is a part of an exam
        // 4. we transfer the "false" data to the exam component
        this.props.getData(
          this.props.next
            ? [false, this.props.next.false]
            : [false, { finish: "finish" }]
        );
      }
      this.setState({ sent: true });
    }
  };

  switch = () => {
    this.setState((prev) => ({ update: !prev.update }));
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };
  render() {
    const { me, user, exam, story, ifWrong, ifRight } = this.props;
    console.log(this.props.userData, this.props.id);
    const userData = this.props.userData.filter(
      (el) => el.quiz.id === this.props.id
    );
    // .filter((el) => el.student.id === me.id);
    console.log(userData);
    return (
      <Styles story={story}>
        <Buttons>
          {!exam && !story && (
            <StyledButton onClick={this.switch}>Настройки</StyledButton>
          )}
          {me && me.id === user && !this.props.exam && !this.props.story ? (
            <DeleteSingleQuiz
              id={me.id}
              quizID={this.props.quizID}
              lessonID={this.props.lessonID}
            />
          ) : null}
        </Buttons>
        {!this.state.update && (
          <>
            <Question story={story}>
              {this.props.question}
              <Textarea
                type="text"
                className="answer"
                name="answer"
                required
                onChange={this.handleChange}
                placeholder="Ответ на вопрос..."
              />
            </Question>
            <Progress display={this.state.progress}>
              <CircularProgress />
            </Progress>
            <Group>
              <Mutation
                mutation={CREATE_QUIZRESULT_MUTATION}
                variables={{
                  quiz: this.props.quizID,
                  lessonID: this.props.lessonID,
                  answer: this.state.answer,
                  correct: this.state.correct === "true",
                }}
                refetchQueries={[{ query: CURRENT_USER_QUERY }]}
              >
                {(createQuizResult, { loading, error }) => (
                  <Button1
                    inputColor={this.state.inputColor}
                    className="button"
                    onClick={async (e) => {
                      e.preventDefault();
                      if (this.props.type === "FORM") {
                        const res1 = await this.onSend();
                      } else {
                        const res = await this.onAnswer();
                      }
                      this.setState({ progress: "false" });
                      if (userData.length === 0) {
                        console.log(1);
                        const res0 = await createQuizResult();
                      }
                      console.log(2);
                    }}
                  >
                    {this.props.type === "FORM" ? "Ответить" : "Проверить"}
                  </Button1>
                )}
              </Mutation>
              {this.props.type !== "FORM" && (
                <div onClick={this.onShow} id="but2">
                  {this.state.hidden === true
                    ? "Открыть ответ"
                    : "Скрыть ответ"}
                </div>
              )}
            </Group>
            <Answer display={this.state.hidden.toString()}>
              {this.props.answer}
              <div>
                {this.state.correct === "true" && ifRight}
                {this.state.correct === "false" && ifWrong}
              </div>
            </Answer>
          </>
        )}
        {this.state.update && (
          <UpdateQuiz
            quizID={this.props.quizID}
            lessonID={this.props.lessonID}
            answer={this.props.answer}
            question={this.props.question}
            notes={this.props.notes}
            quizes={this.props.quizes.filter((q) => q.id !== this.props.quizID)}
            tests={this.props.tests}
          />
        )}
        {this.props.exam && (
          <Dots>
            <div className="group">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </Dots>
        )}
      </Styles>
    );
  }
}

export default SingleQuiz;
