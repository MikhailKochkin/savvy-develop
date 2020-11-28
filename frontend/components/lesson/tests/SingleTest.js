import React, { Component } from "react";
import styled from "styled-components";
import { Mutation } from "@apollo/client/react/components";
import gql from "graphql-tag";
import _ from "lodash";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import AnswerOption from "./AnswerOption";
import UpdateTest from "./UpdateTest";
import DeleteSingleTest from "../../delete/DeleteSingleTest";
import { CURRENT_USER_QUERY } from "../../User";

const StyledButton = withStyles({
  root: {
    width: "15%",
    height: "45px",
    marginRight: "2%",
    fontSize: "1.6rem",
    textTransform: "none",
  },
})(Button);

const CREATE_TESTRESULT_MUTATION = gql`
  mutation CREATE_TESTRESULT_MUTATION(
    $answer: String
    $testID: ID
    $lessonID: ID
  ) {
    createTestResult(answer: $answer, testID: $testID, lessonID: $lessonID) {
      id
    }
  }
`;

const Question = styled.p`
  font-size: 1.8rem;
`;

const Options = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const TextBar = styled.div`
  width: ${(props) => (props.story ? "100%" : "95%")};
  font-size: 1.6rem;
  padding-top: 2%;
  padding-bottom: 2%;
  ul {
    list-style-type: none;
    padding-left: 0px;
  }
  @media (max-width: 800px) {
    width: 100%;
    font-size: 1.5rem;
    padding-left: 5px;
  }
`;

const Group = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 40%;
  border: 1px solid #c4c4c4;
  background: ${(props) => props.inputColor};
  border-radius: 5px;
  padding: 0.5%;
  margin: 3% 0;
  div {
    border: none;
    background: none;
    cursor: pointer;
  }
  #but1 {
    flex: 50%;
    text-align: center;
  }
  &:hover {
    box-shadow: 0 3px 4px rgba(0, 0, 0, 0.1);
  }
`;
const MiniButton = styled.div`
  border: none;
  cursor: pointer;
`;

const Dots = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  height: 90px;
  margin-bottom: 5%;
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

const Comment = styled.div`
  border: 1px solid #c4c4c4;
  padding: 2%;
  border-radius: 5px;
`;

class SingleTest extends Component {
  state = {
    answerState: "think",
    answerOptions: this.props.length,
    answer: [],
    attempts: 0,
    inputColor: "none",
    update: false,
    sent: false,
  };

  answerState = "";

  handleAnswerSelected = async (number, answer) => {
    let answerVar = this.state.answerOptions;
    let int = parseInt(number);
    answerVar[int] = !answerVar[int];
    let answerText = this.state.answer;
    function change() {
      if (!answerText.includes(answer)) {
        answerText.push(answer);
      } else if (answerText.includes(answer)) {
        var index = answerText.indexOf(answer);
        answerText.splice(index, 1);
      }
    }
    const res = await change();
    const res1 = await this.setState({
      answerOptions: answerVar,
      answer: answerText,
    });
  };

  onSend = async () => {
    this.setState({
      answerState: "right",
      inputColor: "rgba(50, 172, 102, 0.25)",
    });
    document.querySelector(".button").disabled = true;
  };

  onCheck = async () => {
    const res1 = await this.setState((prevState) => ({
      attempts: prevState.attempts + 1,
    }));
    const res = () => {
      if (
        JSON.stringify(this.state.answerOptions) ==
        JSON.stringify(this.props.true)
      ) {
        this.setState({
          answerState: "right",
          inputColor: "rgba(50, 172, 102, 0.25)",
        });
        // 1. if the data is sent for the first time
        if (!this.state.sent && this.props.getData) {
          // 2. and if this quiz is a part of an exam
          this.props.getData(
            this.props.next
              ? [true, this.props.next.true]
              : [true, { finish: "finish" }],
            "true"
          );

          document.querySelector(".button").disabled = true;
        }
      } else {
        this.setState({
          answerState: "wrong",
          inputColor: "rgba(222, 107, 72, 0.5)",
        });
        // 1. if the data is sent for the first time
        if (!this.state.sent && this.props.getData) {
          // 2. and if this quiz is a part of an exam
          this.props.getData(
            this.props.next
              ? [false, this.props.next.false]
              : [false, { finish: "finish" }]
          );
        }
      }
    };
    const res2 = await res();
    this.setState({ sent: true });
  };
  switch = () => {
    this.setState((prev) => ({ update: !prev.update }));
  };

  render() {
    const { exam, story, ifWrong, ifRight } = this.props;
    const mes = _.zip(this.props.answers, this.props.true);
    console.log(this.props.userData, this.props.id, this.props.me.id);
    const userData = this.props.userData
      .filter((el) => el.testID === this.props.id)
      .filter((el) => el.student.id === this.props.me.id);
    console.log(userData);
    return (
      <>
        {!exam && story !== true && (
          <StyledButton onClick={this.switch}>
            {!this.state.update ? "Настройки" : "Тест"}
          </StyledButton>
        )}
        {this.props.me &&
          this.props.me.id === this.props.user &&
          !this.props.story &&
          !this.props.exam && (
            <DeleteSingleTest
              id={this.props.me.id}
              testId={this.props.id}
              lessonId={this.props.lessonID}
            />
          )}
        {!this.state.update && (
          <TextBar className="Test" story={story}>
            <Question>{this.props.question}</Question>
            <Options>
              {mes.map((answer, index) => (
                <AnswerOption
                  key={index}
                  answer={answer[0]}
                  correct={answer[1]}
                  number={index}
                  onAnswerSelected={this.handleAnswerSelected}
                />
              ))}
            </Options>
            <Group inputColor={this.state.inputColor}>
              <Mutation
                mutation={CREATE_TESTRESULT_MUTATION}
                variables={{
                  testID: this.props.id,
                  lessonID: this.props.lessonID,
                  answer: this.state.answer.join(", "),
                }}
                refetchQueries={[{ query: CURRENT_USER_QUERY }]}
              >
                {(createTestResult, { loading, error }) => (
                  <MiniButton
                    className="button"
                    id="but1"
                    onClick={async (e) => {
                      // Stop the form from submitting
                      e.preventDefault();
                      // call the mutation
                      if (this.state.answer.length < 1) {
                        alert("Выберите хотя бы один ответ!");
                      } else {
                        if (this.props.type === "FORM") {
                          const res1 = await this.onSend();
                        } else {
                          const res = await this.onCheck();
                        }
                        if (userData.length === 0) {
                          console.log(1);
                          const res0 = await createTestResult();
                        }
                      }
                      console.log(2);
                    }}
                  >
                    Проверить
                  </MiniButton>
                )}
              </Mutation>
            </Group>
            {ifRight && this.state.answerState === "right" && (
              <Comment>{ifRight}</Comment>
            )}
            {ifWrong && this.state.answerState === "wrong" && (
              <Comment>{ifWrong}</Comment>
            )}
          </TextBar>
        )}
        {this.state.update && (
          <UpdateTest
            testID={this.props.id}
            lessonID={this.props.lessonID}
            quizes={this.props.quizes}
            question={this.props.question}
            answers={this.props.answers}
            correct={this.props.true}
            mes={mes}
            next={this.props.next}
            notes={this.props.notes}
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
      </>
    );
  }
}

export default SingleTest;
