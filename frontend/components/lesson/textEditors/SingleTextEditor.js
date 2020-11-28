import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import renderHTML from "react-render-html";
import { Mutation } from "@apollo/client/react/components";
import gql from "graphql-tag";
import DeleteSingleTextEditor from "../../delete/DeleteSingleTextEditor";
import UpdateTextEditor from "./UpdateTextEditor";

import { SINGLE_LESSON_QUERY } from "../SingleLesson";
import { CURRENT_USER_QUERY } from "../../User";

const CREATE_TEXTEDITORRESULT_MUTATION = gql`
  mutation CREATE_TEXTEDITORRESULT_MUTATION(
    $attempts: Int
    $wrong: String!
    $correct: String!
    $guess: String!
    $lesson: ID
    $textEditor: ID
    $result: Boolean
  ) {
    createTextEditorResult(
      attempts: $attempts
      wrong: $wrong
      correct: $correct
      guess: $guess
      lesson: $lesson
      textEditor: $textEditor
      result: $result
    ) {
      id
    }
  }
`;

const TextBar = styled.div`
  width: 100%;
  font-size: 1.6rem;
  border-radius: 5px;
  @media (max-width: 800px) {
    width: 100%;
  }
  pre {
    background: #282c34;
    color: white;
    padding: 2% 4%;
    line-height: 1;
    font-size: 1.4rem;
    border-radius: 10px;
  }
  .edit {
    background: red;
    width: 100%;
    font-size: 1.6rem;
    line-height: 1.8;
    font-family: Montserrat;
    border: none;
    background: none;
    outline: 0;
    resize: none;
    color: #393939;
    overflow: hidden;
    height: auto;
    background: #bef1ed;
    padding: 3px 3px;
  }
  .mini_button {
    color: #6d7578;
    border: 1px solid #6d7578;
    font-family: Montserrat;
    background: none;
    outline: 0;
    border-radius: 3px;
    padding: 4px 7px;
    margin: 0 5px;
    transition: all 0.3s ease;
    &:focus {
      color: white;
      background: #6d7578;
    }
  }
`;

const EditText = styled.div`
  color: rgb(17, 17, 17);
  max-width: 740px;
  background: rgb(255, 255, 255);
  -webkit-box-shadow: 0px 0px 3px 0px rgba(199, 199, 199, 1);
  -moz-box-shadow: 0px 0px 3px 0px rgba(199, 199, 199, 1);
  box-shadow: 0px 0px 3px 0px rgba(199, 199, 199, 1);
  padding: 5% 8%;
  margin: 55px auto 45px;
`;

const Button = styled.button`
  padding: 1%;
  background: ${(props) => props.theme.green};
  max-width: 30%;
  border-radius: 5px;
  border: ${(props) => props.theme.green};
  color: white;
  font-size: 1.6rem;
  font-family: Montserrat;
  margin: 2% 0;
  cursor: pointer;
  outline: 0;
  &:active {
    background-color: ${(props) => props.theme.darkGreen};
  }
  @media (max-width: 800px) {
    width: 50%;
  }
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
`;

class SingleTextEditor extends Component {
  state = {
    shown: false,
    mistakesShown: false,
    answer: "",
    correct_option: "",
    wrong_option: "",
    show: false,
    attempts: 0,
    total: this.props.textEditor.totalMistakes,
    text: this.props.textEditor.text,
    update: false,
    result: false,
    inputColor: "#c0d6df",
    open: true,
  };

  onTest = (e) => {
    this.setState((prevState) => ({
      attempts: prevState.attempts + 1,
    }));
  };

  onMouseClick = (e) => {
    let z = document.createElement("span");
    z.contentEditable = true;
    z.innerHTML = e.target.innerHTML;
    z.className = "edit";
    z.setAttribute("data-initial", e.target.getAttribute("data"));
    z.addEventListener("input", this.changeState);
    let n = e.target.parentNode.replaceChild(z, e.target);

    let button = document.createElement("button");
    button.innerHTML = "Проверить";
    button.className = "mini_button";
    button.addEventListener("click", this.check);
    z.after(button);

    this.setState({
      answer: "",
      correct_option: e.target.getAttribute("data"),
      wrong_option: e.target.innerHTML,
    });
  };

  changeState = (e) => {
    this.setState({ answer: e.target.innerHTML });
  };

  onReveal = (e) => {
    console.log(e.target);
    e.target.className = "edit";
    let span = document.createElement("span");
    span.innerHTML = `(${e.target.getAttribute("data")})`;
    span.className = "edit";
    if (span.innerHTML !== e.target.nextSibling.innerHTML) {
      e.target.after(span);
    }
  };

  show = (e) => {
    e.target.previousSibling.previousSibling.innerHTML = e.target.previousSibling.previousSibling.getAttribute(
      "data-initial"
    );
    e.target.style.pointerEvents = "none";
    e.target.previousSibling.style.display = "none";
    e.target.style.display = "none";
    e.target.previousSibling.previousSibling.contentEditable = false;
    e.target.previousSibling.previousSibling.style.pointerEvents = "none";
  };

  check = async (e) => {
    this.setState({ shown: true });
    let data = {
      answer1: this.state.correct_option.toLowerCase(),
      answer2: this.state.answer.toLowerCase(),
    };
    let el = document.querySelectorAll(
      `[data-initial='${this.state.correct_option}']`
    )[0];
    const r = await fetch("https://arcane-refuge-67529.herokuapp.com/checker", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((res) => {
        console.log(res);
        if (
          !e.target.nextSibling ||
          (e.target.nextSibling &&
            e.target.nextSibling.innerHTML !== "Показать")
        ) {
          let button2 = document.createElement("button");
          button2.innerHTML = "Показать";
          button2.className = "mini_button";
          button2.addEventListener("click", this.show);
          e.target.after(button2);
        }
        if (parseFloat(res.res) > 69) {
          this.setState({
            result: true,
          });
          el.style.background = "#D9EAD3";
        } else {
          this.setState({
            result: false,
          });
          el.style.background = "#FCE5CD";
          if (res.comment) {
            alert(res.comment);
          }
          setTimeout(() => (el.style.background = "#bef1ed"), 3000);
        }
      })
      .catch((err) => console.log(err));
    this.setState({ shown: false });
  };

  onShow = () => {
    const elements = document.querySelectorAll("#id");
    if (this.state.mistakesShown) {
      elements.forEach((element) => {
        element.classList.remove("edit");
      });
    } else {
      elements.forEach((element) => {
        element.className = "edit";
      });
    }
    this.setState((prev) => ({ mistakesShown: !prev.mistakesShown }));
  };
  render() {
    const { textEditor, me, userData, lesson } = this.props;
    // const data = userData
    //   .filter((result) => result.textEditor.id === textEditor.id)
    //   .filter((result) => result.student.id === me.id);
    return (
      <>
        {!this.state.update && (
          <>
            <TextBar>
              <EditText>
                <Mutation
                  mutation={CREATE_TEXTEDITORRESULT_MUTATION}
                  variables={{
                    lesson: this.props.lesson,
                    textEditor: this.props.textEditor.id,
                    attempts: this.state.attempts,
                    correct: this.state.correct_option,
                    wrong: this.state.wrong_option,
                    guess: this.state.answer,
                    result: this.state.result,
                  }}
                  refetchQueries={() => [
                    {
                      query: SINGLE_LESSON_QUERY,
                      variables: { id: this.props.lesson },
                    },
                    {
                      query: CURRENT_USER_QUERY,
                    },
                  ]}
                >
                  {(createTextEditorResult, { loading, error }) => (
                    <div
                      onClick={async (e) => {
                        const res1 = this.onTest();
                        if (e.target.id === "id") {
                          if (this.state.total > 0) {
                            const res2 = await this.onMouseClick(e);
                          } else if (this.state.total == 0) {
                            const res3 = await this.onReveal(e);
                          }
                        }
                        if (this.state.shown) {
                          setTimeout(() => {
                            console.log("Save");
                            const res2 = createTextEditorResult();
                          }, 3000);
                        }
                      }}
                    >
                      {renderHTML(this.state.text)}
                    </div>
                  )}
                </Mutation>
              </EditText>
            </TextBar>
            <Buttons>
              <Button onClick={this.onShow}>
                {this.state.mistakesShown ? "Скрыть ошибки" : "Показать ошибки"}
              </Button>
              {me && me.id === textEditor.user.id && !this.props.story ? (
                <DeleteSingleTextEditor
                  id={this.props.textEditor.id}
                  lessonID={this.props.lessonID}
                />
              ) : null}
              {me && me.id === textEditor.user.id && !this.props.story && (
                <button
                  onClick={(e) =>
                    this.setState((prev) => ({ update: !prev.update }))
                  }
                >
                  Изменить
                </button>
              )}
            </Buttons>
          </>
        )}
        {this.state.update && (
          <UpdateTextEditor
            lessonID={this.props.lessonID}
            id={this.props.textEditor.id}
            text={this.state.text}
            totalMistakes={this.state.total}
          />
        )}
      </>
    );
  }
}

SingleTextEditor.propTypes = {
  lesson: PropTypes.string.isRequired,
  textEditor: PropTypes.object.isRequired,
  key: PropTypes.string.isRequired,
  me: PropTypes.object.isRequired,
  userData: PropTypes.object.isRequired,
};

export default SingleTextEditor;
