import React, { useState } from "react";
import styled from "styled-components";
import { Mutation } from "@apollo/client/react/components";
import gql from "graphql-tag";
import _ from "lodash";
import { Message } from "../styles/Button";
import { SINGLE_LESSON_QUERY } from "../lesson/SingleLesson";

const CREATE_NEWTEST_MUTATION = gql`
  mutation CREATE_NEWTEST_MUTATION(
    $question: [String!]
    $answers: [String!]
    $correct: [Boolean!]
    $ifRight: String
    $ifWrong: String
    $lessonID: ID!
  ) {
    createNewTest(
      question: $question
      answers: $answers
      correct: $correct
      ifRight: $ifRight
      ifWrong: $ifWrong
      lessonID: $lessonID
    ) {
      id
    }
  }
`;

const Button = styled.button`
  background: #84bc9c;
  cursor: pointer;
  padding: 1% 2%;
  width: 125px;
  border-radius: 5px;
  font-size: 1.6rem;
  color: white;
`;

const TestCreate = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 1% 2%;
`;

const Form = styled.form`
  font-size: 1.6rem;
  background: white;
  fieldset {
    border: none;
    textarea {
      font-size: 1.8rem;
    }
  }
`;

const Answers = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 3%;
`;

const CustomSelect1 = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 30%;
  @media (max-width: 800px) {
    width: 65%;
  }
  select {
    border: 1px solid #c4c4c4;
    background: none;
    width: 40px;
    font-size: 1.6rem;
  }
`;

const AnswerOption = styled.div`
  display: flex;
  flex-direction: column;
  margin: 2% 0;
  textarea {
    border-radius: 5px;
    border: 1px solid #c4c4c4;
    width: 80%;
    height: 100px;
    padding: 1.5%;
    font-size: 1.4rem;
    outline: 0;
  }
  select {
    width: 20%;
    font-size: 1.4rem;
    outline: none;
    line-height: 1.3;
    padding: 0.5% 1%;
    /* padding: 0.6em 1.4em 0.5em 0.8em; */
    max-width: 100%;
    box-sizing: border-box;
    margin-top: 2%;
    border: 1px solid #c5c5c5;
    border-radius: 4px;
    background: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    background-color: #fff;
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E"),
      linear-gradient(to bottom, #ffffff 0%, #ffffff 100%);
    background-repeat: no-repeat, repeat;
    background-position: right 0.7em top 50%, 0 0;
    background-size: 0.65em auto, 100%;
  }
`;

const Advice = styled.p`
  font-size: 1.5rem;
  margin: 1% 4%;
  background: #fdf3c8;
  border: 1px solid #c4c4c4;
  border-radius: 10px;
  padding: 2%;
  margin: 30px 0;
  width: 80%;
`;

const Question = styled.div`
  margin-top: 3%;
  textarea {
    border-radius: 5px;
    border: 1px solid #c4c4c4;
    width: 80%;
    height: 100px;
    padding: 1.5%;
    font-size: 1.4rem;
    outline: 0;
  }
`;

const Title = styled.div`
  font-size: 2.2rem;
  font-weight: 600;
  margin-bottom: 2%;
`;

const CreateNewTest = (props) => {
  const [num, setNum] = useState(2);
  const [ifRight, setIfRight] = useState("");
  const [ifWrong, setIfWrong] = useState("");
  const [answers, setAnswers] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [correct, setCorrect] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [question, setQuestion] = useState();

  const handleArray = (val, i) => {
    let arr = [...answers];
    arr[i] = val;
    return setAnswers(arr);
  };

  const handleCorrect = (val, i) => {
    let arr = [...correct];
    let value;
    val === "true" ? (value = true) : (value = false);
    arr[i] = value;
    return setCorrect(arr);
  };

  const { lessonID } = props;
  return (
    <TestCreate>
      <Mutation
        mutation={CREATE_NEWTEST_MUTATION}
        variables={{
          lessonID: lessonID,
          question: [question],
          answers: answers,
          correct: correct,
          ifRight: ifRight,
          ifWrong: ifWrong,
        }}
        refetchQueries={() => [
          {
            query: SINGLE_LESSON_QUERY,
            variables: { id: lessonID },
          },
        ]}
        awaitRefetchQueries={true}
      >
        {(createNewTest, { loading, error }) => (
          <Form
            onSubmit={async (e) => {
              e.preventDefault();
              const res = await setAnswers(answers.filter((an) => an !== ""));
              let arr = correct;
              arr.length = answers.filter((an) => an !== "").length;
              const res2 = await setCorrect(arr);
              createNewTest();
              alert("Готово!");
              setIfRight("");
              setIfWrong("");
              setQuestion("");
              setAnswers(["", "", "", "", "", "", "", "", "", ""]);
              setCorrect([
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
              ]);
            }}
          >
            <Advice>
              Создайте новый тест. Введите сам вопрос, 2-9 вариантов ответа.
              Количество правильных ответов может быть любым.
            </Advice>
            <Title>Новый тест</Title>
            <CustomSelect1>
              Вариантов ответа:
              <span></span>
              <select
                name="answerNumber"
                onChange={(e) => setNum(e.target.value)}
              >
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
              </select>
            </CustomSelect1>

            <Question>
              <textarea
                id="question"
                name="question"
                spellCheck={true}
                placeholder="Вопрос"
                autoFocus
                required
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </Question>
            <Answers>
              {_.times(num, (i) => {
                let answer = `answer${i + 1}`;
                return (
                  <AnswerOption id={answer}>
                    <textarea
                      name={answer}
                      placeholder={`Ответ ${i + 1}`}
                      onChange={(e) => handleArray(e.target.value, i)}
                    />
                    <select
                      defaultValue={false}
                      onChange={(e) => handleCorrect(e.target.value, i)}
                    >
                      <option value={true}>Правильно</option>
                      <option value={false}>Ошибочно</option>
                    </select>
                  </AnswerOption>
                );
              })}
            </Answers>
            <Question>
              <textarea
                id="ifRight"
                name="ifRight"
                spellCheck={true}
                placeholder="Комментарий в случае правильного ответа"
                autoFocus
                required
                value={ifRight}
                onChange={(e) => setIfRight(e.target.value)}
              />
            </Question>
            <Question>
              <textarea
                id="ifRight"
                name="ifRight"
                spellCheck={true}
                placeholder="Комментарий в случае неправильного ответа"
                autoFocus
                required
                value={ifWrong}
                onChange={(e) => setIfWrong(e.target.value)}
              />
            </Question>
            <Button type="submit">
              {loading ? "Сохраняем..." : "Сохранить"}
            </Button>
            <Message id="Message">Вы создали новый тестовый вопрос!</Message>
          </Form>
        )}
      </Mutation>
    </TestCreate>
  );
};

export default CreateNewTest;
