import React, { Component } from "react";
import { Mutation } from "@apollo/client/react/components";
import gql from "graphql-tag";
import styled from "styled-components";
import { SINGLE_LESSON_QUERY } from "../lesson/SingleLesson";

const DELETE_SHOT_MUTATION = gql`
  mutation DELETE_SHOT_MUTATION($id: ID!) {
    deleteShot(id: $id) {
      id
    }
  }
`;

const Button = styled.button`
  background: ${props => props.theme.red};
  width: 20%;
  color: white;
  padding: 1.5% 3%;
  font-size: 1.6rem;
  font-weight: 600;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  outline: none;
  &:active {
    background-color: ${props => props.theme.darkRed};
  }
  @media (max-width: 800px) {
    width: 40%;
  }
`;

class DeleteSingleQuiz extends Component {
  render() {
    const { shotID, lessonID } = this.props;
    return (
      <Mutation
        mutation={DELETE_SHOT_MUTATION}
        variables={{ id: shotID }}
        refetchQueries={() => [
          {
            query: SINGLE_LESSON_QUERY,
            variables: { id: lessonID }
          }
        ]}
      >
        {(deleteShot, { error, loading }) => (
          <Button
            onClick={() => {
              if (
                confirm(
                  "Вы точно хотите удалить эту раскадровку? Она исчезнет после перезагрузки страницы."
                )
              ) {
                deleteShot().catch(error => {
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
  }
}

export default DeleteSingleQuiz;
