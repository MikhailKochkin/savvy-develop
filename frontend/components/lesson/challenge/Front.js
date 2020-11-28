import React from "react";
import renderHTML from "react-render-html";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import Result from "./Result";
import { makeStyles } from "@material-ui/core/styles";

const LessonPart = styled.div`
  display: flex;
  border: 1px solid #edefed;
  padding: 0.5% 2%;
  flex-direction: column;
  border-radius: 2px;
  margin: 0 0 20px 0;
  .intro {
    border-bottom: 1px solid #f4f2f2;
    margin-bottom: 2%;
  }
  a {
    padding-top: 2%;
    padding-left: 2%;
  }
  img {
    display: block;
    max-width: 100%;
    max-height: 20em;
    margin-top: 2%;
    box-shadow: "0 0 0 2px blue;";
  }
  @media (max-width: 800px) {
    margin: 1%;
    width: 90%;
  }
  .example-enter {
    opacity: 0.01;
  }

  .example-enter.example-enter-active {
    opacity: 1;
    transition: opacity 500ms ease-in;
  }

  .example-leave {
    opacity: 1;
  }

  .example-leave.example-leave-active {
    opacity: 0.01;
    transition: opacity 300ms ease-in;
  }
`;

const Header = styled.div`
  border: 1px solid #edefed;
  background: #1a2980;
  color: white;
  margin-top: 40px;
  border-bottom: 0;
  width: 100%;
  text-align: left;
  padding: 5px 2% 5px 2%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  @media (max-width: 800px) {
    width: 90%;
  }
`;

const useStyles = makeStyles({
  button: {
    width: "35%",
    margin: "2% 0",
    fontSize: "1.4rem",
    textTransform: "none",
  },
  root: {
    marginBottom: "4%",
  },
  labelRoot: {
    fontSize: "1.5rem",
  },
});

const Front = (props) => {
  const classes = useStyles();
  let results = [...props.results].sort((r, n) => {
    let r1 = n.correct - r.correct;
    if (r1 != 0) {
      return r1;
    }
    return r.time - n.time;
  });
  return (
    <>
      <Header>
        <div>Испытание</div>
      </Header>
      <LessonPart>
        <div className="intro">{renderHTML(props.text)}</div>
        {!props.completed.length > 0 ? (
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={(e) => props.getStart(true)}
          >
            Начать
          </Button>
        ) : (
          <Result
            results={results}
            completed={props.completed}
            text="Вы уже прошли это испытание. Ваш результат:"
          />
        )}
      </LessonPart>
    </>
  );
};

export default Front;
