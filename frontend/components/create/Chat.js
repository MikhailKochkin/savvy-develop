import React from "react";
import CreateQuiz from "./CreateQuiz";

const Chat = props => {
  const getRight = () => {
    console.log("!!!");
  };
  const getLeft = () => {
    console.log("!");
  };
  return (
    <>
      <p>Составьте цепочку вопросов и тестов для ответов.</p>
      <CreateQuiz
        lessonID={props.lessonID}
        getRight={getRight}
        getLeft={getLeft}
      />
    </>
  );
};

export default Chat;
