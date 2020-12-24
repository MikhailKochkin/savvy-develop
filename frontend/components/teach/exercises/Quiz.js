import { useState } from "react";
import styled from "styled-components";
import renderHTML from "react-render-html";
import { useQuery, gql } from "@apollo/client";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import moment from "moment";
const GET_QUIZ_RESULTS = gql`
  query quizResults($quizId: String!) {
    quizResults(where: { quizId: { equals: $quizId } }) {
      id
      correct
      student {
        id
        name
        surname
      }
      quiz {
        id
      }
      answer
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
      background: #f9dcc4;
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
  .header {
    font-size: 1.6rem;
  }
  button {
    margin-left: 5px;
  }
`;

const StyledButton = withStyles({
  root: {
    margin: "1% 0",
    marginRight: "2%",
    fontSize: "1.6rem",
    textTransform: "none",
  },
})(Button);

const Quiz = (props) => {
  const [reveal, setReveal] = useState(false);
  const { quiz, index } = props;

  const {
    loading: quiz_loading,
    error: quiz_error,
    data: quiz_data,
  } = useQuery(GET_QUIZ_RESULTS, {
    variables: { quizId: quiz.id },
  });
  if (quiz_loading) return "Loading...";
  if (quiz_error) return `Error! ${quiz_error.message}`;
  return (
    <>
      <Styles>
        <div className="div1">
          <div className="type">
            <b>Вопрос {index}: </b>
          </div>
          {renderHTML(quiz.question)}
        </div>
        <div className="div2">
          <div>
            <b>Правильный ответ: </b>
          </div>
          {renderHTML(quiz.answer)}
          <br />
          <StyledButton onClick={(e) => setReveal(!reveal)}>
            {reveal ? "Закрыть" : "Открыть"}
          </StyledButton>
        </div>
      </Styles>
      {reveal &&
        quiz_data.quizResults.map((t) => (
          <div>
            <b>
              {`${t.student.name} ${
                t.student.surname ? t.student.surname : ""
              }`}
              :{" "}
            </b>
            {renderHTML(t.answer)}
            {t.correct ? " Правильно" : " Неправильно"}
          </div>
        ))}
    </>
  );
};

export default Quiz;
