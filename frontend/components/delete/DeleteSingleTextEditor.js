import React from "react";
import { Mutation } from "@apollo/client/react/components";
import gql from "graphql-tag";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { SINGLE_LESSON_QUERY } from "../lesson/SingleLesson";

const DELETE_TEXTEDITOR_MUTATION = gql`
  mutation DELETE_TEXTEDITOR_MUTATION($id: ID!) {
    deleteTextEditor(id: $id) {
      id
    }
  }
`;

const useStyles = makeStyles({
  button: {
    width: "15%",
    margin: "4% 0",
    fontSize: "1.6rem",
    textTransform: "none"
  }
});

const DeleteSingleProblem = props => {
  const classes = useStyles();
  const { lessonID, id } = props;
  return (
    <Mutation
      mutation={DELETE_TEXTEDITOR_MUTATION}
      variables={{ id }}
      refetchQueries={() => [
        {
          query: SINGLE_LESSON_QUERY,
          variables: { id: lessonID }
        }
      ]}
    >
      {(deleteTextEditor, { loading, error }) => (
        <Button
          className={classes.button}
          color="secondary"
          onClick={() => {
            if (
              confirm(
                "Вы точно хотите удалить эту запись? Запись исчезнет после перезагрузки страницы."
              )
            ) {
              deleteTextEditor().catch(error => {
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

export default DeleteSingleProblem;
