import React, { Component } from "react";
import styled from "styled-components";
import renderHTML from "react-render-html";
import Modal from "styled-react-modal";

const Box = styled.div`
  display: flex;
  justify-content: row;
  margin-bottom: 1%;
  div {
    flex: 50%;
    &.column {
      padding-left: 2%;
      border-left: 1px solid #edefed;
    }
  }
`;

const Block = styled.div``;

const StyledModal = Modal.styled`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border: 1px solid grey;
  border-radius: 10px;
  padding: 1% 2%;
  width: 40%;
  height: 60%;
  @media (max-width: 800px) {
    width: 90%;
    height: 90%;
  }
`;

const Modal2 = styled.div`
  height: 100%;
  overflow-y: scroll;
`;

const Button = styled.button`
  text-align: center;
  background: #ffffff;
  border: 1px solid #112a62;
  border-radius: 5px;
  cursor: pointer;
  outline: 0;
  margin: 1% 0;
  color: #112a62;
  font-size: 1.4rem;
  a {
    color: #112a62;
  }
`;

class ProblemModal extends Component {
  state = {
    isOpen: false,
  };
  toggleModal = (e) => {
    this.setState((prevState) => ({ isOpen: !prevState.isOpen }));
  };
  render() {
    const { problem, student } = this.props;
    let mail = `body:${student.email}`;
    return (
      <>
        <Box key={problem.id}>
          <div>
            <b>Задача: </b>
            {renderHTML(`${problem.text.substring(0, 400) + "..."}`)}
          </div>
          <div className="column">
            <div>Открытые подсказки:</div>

            <div>
              {problem.problemResults.filter((t) => t.student.id === student.id)
                .length > 0 ? (
                problem.problemResults
                  .filter((t) => t.student.id === student.id)[0]
                  .revealed.map((t) => <li>{t}</li>)
              ) : (
                <span>Не выполнена</span>
              )}
            </div>
          </div>
          <div className="column">
            {problem.problemResults.filter((t) => t.student.id === student.id)
              .length > 0 ? (
              problem.problemResults
                .filter((t) => t.student.id === student.id)
                .map((t) => (
                  <>
                    {t.answer.length < 200 ? (
                      <span>{renderHTML(t.answer)}</span>
                    ) : (
                      <span>
                        {renderHTML(t.answer.substring(0, 200) + "...")}
                      </span>
                    )}
                    <Button onClick={this.toggleModal}>
                      <a>Развернуть</a>
                    </Button>
                  </>
                ))
            ) : (
              <span>Не выполнена</span>
            )}
          </div>
        </Box>
        <StyledModal
          isOpen={this.state.isOpen}
          onBackgroundClick={this.toggleModal}
          onEscapeKeydown={this.toggleModal}
        >
          {problem.problemResults.filter((t) => t.student.id === student.id)
            .length > 0 ? (
            problem.problemResults
              .filter((t) => t.student.id === student.id)
              .map((t) => {
                return (
                  <Modal2>
                    <div id="toCopy">{renderHTML(t.answer)}</div>
                  </Modal2>
                );
              })
          ) : (
            <span>Не выполнена</span>
          )}
        </StyledModal>
      </>
    );
  }
}

export default ProblemModal;
