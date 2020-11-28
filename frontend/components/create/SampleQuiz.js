import React from "react";

const SampleQuiz = props => {
  return (
    <div>
      <p>Сам вопрос</p>
      <p>{props.question}</p>
      <p>{props.answer}</p>
      <p>{props.id}</p>
      <p>Правильный ответ</p>
      <p>Неправильный ответ</p>
    </div>
  );
};

export default SampleQuiz;
