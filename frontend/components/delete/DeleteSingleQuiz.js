import React, { useState } from "react";
import { Mutation } from "@apollo/client/react/components";
import gql from "graphql-tag";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { SINGLE_LESSON_QUERY } from "../lesson/SingleLesson";

const DELETE_QUIZ_MUTATION = gql`
  mutation DELETE_QUIZ_MUTATION($id: ID!) {
    deleteQuiz(id: $id) {
      id
    }
  }
`;

const useStyles = makeStyles({
  button: {
    margin: "4% 0",
    fontSize: "1.6rem",
    textTransform: "none"
  }
});

const DeleteSingleQuiz = props => {
  const { quizID, lessonID } = props;
  const classes = useStyles();
  return (
    <Mutation
      mutation={DELETE_QUIZ_MUTATION}
      variables={{ id: quizID }}
      refetchQueries={() => [
        {
          query: SINGLE_LESSON_QUERY,
          variables: { id: lessonID }
        }
      ]}
    >
      {(deleteQuiz, { error, loading }) => (
        <Button
          className={classes.button}
          color="secondary"
          onClick={() => {
            if (
              confirm(
                "Вы точно хотите удалить этот вопрос? Вопрос исчезнет после перезагрузки страницы."
              )
            ) {
              deleteQuiz().catch(error => {
                alert(error.message);
              });
            }
          }}
        >
          {loading ? "Удаляем..." : "Удалить"}
        </Button>
      )}
    </Mutation>
  );
};

export default DeleteSingleQuiz;

//   update = async (cache, payload) => {
//     // manually update the cache on the client, so it matches the server
//     // 1. Read the cache for the items we want
//     const data = cache.readQuery({
//       query: SINGLE_LESSON_QUERY,
//       variables: { id: this.props.lessonID }
//     });
//     console.log(data.lesson.quizes, payload.data.deleteQuiz.id);

//     // 2. Filter the deleted itemout of the page
//     data.lesson = data.lesson.quizes.filter(
//       item => item.id !== payload.data.deleteQuiz.id
//     );
//     // 3. Put the items back!
//     console.log(data.lesson);
//     const res = await cache.writeQuery({
//       query: SINGLE_LESSON_QUERY,
//       variables: { id: this.props.lessonID },
//       data: data.lesson
//     });
//   };
