import React, { useState } from "react";
import { Mutation } from "@apollo/client/react/components";
import gql from "graphql-tag";
import dynamic from "next/dynamic";
import PropTypes from "prop-types";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const CREATE_CLAUSE_MUTATION = gql`
  mutation CREATE_CLAUSE_MUTATION(
    $commentary: String!
    $sample: String!
    $tags_arguments: [String!]
    $tags_intro: [String!]
    $number: Int!
    $document: ID!
  ) {
    createClause(
      commentary: $commentary
      sample: $sample
      tags_arguments: $tags_arguments
      tags_intro: $tags_intro
      number: $number
      document: $document
    ) {
      id
    }
  }
`;

const Styles = styled.div`
  margin-top: 2%;
  width: 90%;
  #big {
    margin-top: 3%;
  }
`;

const Condition = styled.div`
  font-size: 1.7rem;
  input {
    display: inline-block;
    border: none;
    margin-left: 1%;
    font-family: Montserrat;
    font-size: 1.7rem;
    outline: 0;
  }
`;

const Frame = styled.div`
  border: 1px solid #c4c4c4;
  border-radius: 10px;
  padding: 0 2%;
  margin: 2% 0;
`;

const Input = styled.input`
  width: 100%;
  background: none;
  font-size: 1.6rem;
  border: none;
  font-family: Montserrat;
  outline: 0;
  border-bottom: 1px solid #edefed;
  padding-bottom: 0.5%;
  &:focus {
    border-bottom: 1px solid #1a2a81;
  }
`;

const useStyles = makeStyles({
  button: {
    // width: "40%",
    margin: "4% 0",
    fontSize: "1.6rem",
    textTransform: "none"
  }
});

const DynamicLoadedEditor = dynamic(import("../../editor/HoverEditor"), {
  loading: () => <p>...</p>,
  ssr: false
});

const CreateClause = props => {
  const [number, setNumber] = useState(props.index);
  const [commentary, setCommentary] = useState("Комментарий по условию");
  const [sample, setSample] = useState("Пример условия");
  const [tags_intro, setIntro] = useState([]);
  const [tags_arguments, setArguments] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const myCallback = (dataFromChild, name) => {
    if (name === "sample") {
      setSample(dataFromChild);
    } else if (name === "commentary") {
      setCommentary(dataFromChild);
    }
  };
  const classes = useStyles();
  const { index, document } = props;
  return (
    <Styles>
      <Mutation
        mutation={CREATE_CLAUSE_MUTATION}
        variables={{
          document,
          commentary,
          sample,
          tags_intro,
          tags_arguments,
          number
        }}
      >
        {(createClause, { loading, error }) => (
          <form disabled={disabled}>
            <Condition>
              Условие
              <input
                type="number"
                value={number}
                onChange={e => setNumber(event.target.value)}
              />
            </Condition>
            <Frame>
              <DynamicLoadedEditor
                index={index}
                value={commentary}
                name="commentary"
                getEditorText={myCallback}
                placeholder={`<p>Часть ${index} документа...</p>`}
              />
            </Frame>
            <Frame>
              <DynamicLoadedEditor
                index={index}
                value={sample}
                name="sample"
                getEditorText={myCallback}
                placeholder={`<p>Часть ${index} документа...</p>`}
              />
            </Frame>
            <div>
              <Input
                placeholder="Ключевые слова: введение"
                onChange={e => setIntro(event.target.value.split(", "))}
              />
            </div>
            <div id="big">
              <Input
                placeholder="Ключевые слова: аргументы"
                onChange={e => setArguments(event.target.value.split(", "))}
              />
            </div>
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              onClick={async e => {
                e.preventDefault();
                const res = await createClause();
                setDisabled(true);
                alert("Сохранили!");
              }}
            >
              Сохранить
            </Button>
          </form>
        )}
      </Mutation>
    </Styles>
  );
};

CreateClause.propTypes = {
  document: PropTypes.string.isRequired
};

export default CreateClause;
