import React from "react";
import { Mutation } from "@apollo/client/react/components";
import gql from "graphql-tag";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { SINGLE_LESSON_QUERY } from "../SingleLesson";

const DELETE_EXAM_MUTATION = gql`
  mutation DELETE_EXAM_MUTATION($id: ID!) {
    deleteExam(id: $id) {
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

const DeleteExam = props => {
  const classes = useStyles();
  const { examID, lessonID } = props;
  return (
    <Mutation
      mutation={DELETE_EXAM_MUTATION}
      variables={{ id: examID }}
      refetchQueries={() => [
        {
          query: SINGLE_LESSON_QUERY,
          variables: { id: lessonID }
        }
      ]}
    >
      {(deleteExam, { error, loading }) => (
        <Button
          className={classes.button}
          color="secondary"
          onClick={() => {
            if (confirm("Вы точно хотите удалить этот экзамен?")) {
              deleteExam().catch(error => {
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

export default DeleteExam;
