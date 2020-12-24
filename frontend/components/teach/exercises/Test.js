import { useState } from "react";
import styled from "styled-components";
import renderHTML from "react-render-html";
import { useQuery, gql } from "@apollo/client";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import moment from "moment";

const GET_TEST_RESULTS = gql`
  query testResults($testId: String!) {
    testResults(where: { testId: { equals: $testId } }) {
      id
      answer
      test {
        id
        question
      }
      student {
        id
        name
        surname
      }
      createdAt
    }
  }
`;

const Styles = styled.div`
  /* margin: 0 1%; */
  margin: 10px 0;
  padding: 1%;
  border: 1px solid;
  border-color: #edefed;
  box-sizing: border-box;
  border-radius: 5px;
  display: grid;
  grid-template-columns: repeat(2, 4fr) repeat(3, 0);
  grid-template-rows: 0 1fr repeat(3, 0);
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  .div1 {
    grid-area: 2 / 1 / 3 / 2;
    padding: 2%;
    .variants {
      border-top: 1px solid #edefed;
    }
    .type {
      background: #a8dadc;
      display: inline-block;
      padding: 2% 4%;
      transform: skew(-5deg);
      -webkit-transform: skew(-5deg);
      -moz-transform: skew(-5deg);
      -o-transform: skew(-5deg);
    }
  }
  .div2 {
    grid-area: 2 / 2 / 3 / 3;
    border-left: 1px solid #edefed;
    padding: 2% 4%;
  }
  /* .div3 {
    grid-area: 2 / 3 / 3 / 4;
    border-left: 1px solid #edefed;
    padding: 2%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  } */
  .header {
    font-size: 1.6rem;
  }
  button {
    margin-left: 5px;
  }
`;

const Answer = styled.div`
  border-bottom: 1px solid #edefed;
  padding: 1%;
`;

const StyledButton = withStyles({
  root: {
    margin: "1% 0",
    marginRight: "2%",
    fontSize: "1.6rem",
    textTransform: "none",
  },
})(Button);

const Test = (props) => {
  const [reveal, setReveal] = useState(false);
  moment.locale("ru");

  const getAllIndexes = (arr, val) => {
    var indexes = [],
      i;
    for (i = 0; i < arr.length; i++) if (arr[i] === val) indexes.push(i);
    return indexes;
  };

  const { test, index } = props;

  const {
    loading: test_loading,
    error: test_error,
    data: test_data,
  } = useQuery(GET_TEST_RESULTS, {
    variables: { testId: test.id },
  });
  if (test_loading) return "Loading...";
  if (test_error) return `Error! ${test_error.message}`;
  console.log(test);

  return (
    <>
      <Styles>
        <div className="div1">
          <div className="type">
            <b>Тест {index}: </b>
          </div>
          {renderHTML(test.question[0])}
          {test.answers.map((t) => (
            <div className="variants">{renderHTML(t)}</div>
          ))}
        </div>
        <div className="div2">
          <div>
            <b>Правильный ответ:</b>
          </div>
          {getAllIndexes(test.correct, true).map((i) => (
            <div>{renderHTML(test.answers[i])}</div>
          ))}
          <StyledButton onClick={(e) => setReveal(!reveal)}>
            {reveal ? "Закрыть" : "Открыть"}
          </StyledButton>
        </div>
      </Styles>
      {reveal && (
        <>
          {test_data.testResults.map((t, i) => (
            <Answer>
              <b>
                {`${i + 1}. ${t.student.name} ${
                  t.student.surname ? t.student.surname : ""
                }`}
                :{" "}
              </b>
              {renderHTML(t.answer)}
              {moment(t.createdAt).format("LLL")}
            </Answer>
          ))}
        </>
      )}
    </>
  );
};

export default Test;
