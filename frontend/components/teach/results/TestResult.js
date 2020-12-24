import React, { Component } from "react";
import styled from "styled-components";
import renderHTML from "react-render-html";
import moment from "moment";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  font-size: 1.4rem;
  p {
    margin: 0.5% 0;
  }
  .answer {
    border-top: 2px solid #edefed;
    border-bottom: 2px solid #edefed;
  }
`;

const Box = styled.div`
  display: flex;
  justify-content: row;
  margin-bottom: 1%;
  li {
    flex: 50%;
  }
  div {
    flex: 50%;
    padding: 0 1%;
    &.column {
      padding-left: 2%;
      border-left: 1px solid #edefed;
      .block {
        padding: 2% 0;
        border-bottom: 1px solid #edefed;
      }
    }
  }
`;

class TestResult extends Component {
  getAllIndexes = (arr, val) => {
    var indexes = [],
      i;
    for (i = 0; i < arr.length; i++) if (arr[i] === val) indexes.push(i);
    return indexes;
  };
  render() {
    const { newTests, student, results } = this.props;
    moment.locale("ru");
    console.log(newTests, results);
    return (
      <Container>
        {newTests.length > 0 &&
          newTests.map((test) => (
            <Box>
              <div>
                <b>Тест: </b>
                {renderHTML(test.question[0])}
              </div>
              <div className="column">
                <div>
                  <b>Правильный ответ:</b>
                </div>
                {this.getAllIndexes(test.correct, true).map((i) =>
                  renderHTML(test.answers[i])
                )}
              </div>
              <div className="column">
                {results.length > 0 ? (
                  results.map((t) => (
                    <div className="block">
                      {renderHTML(t.answer)}({moment(t.createdAt).format("LLL")}
                      )
                    </div>
                  ))
                ) : (
                  <span>Не выполнен</span>
                )}
              </div>
            </Box>
          ))}
      </Container>
    );
  }
}

export default TestResult;
