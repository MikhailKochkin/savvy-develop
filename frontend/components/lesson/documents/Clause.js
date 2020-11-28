import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import dynamic from "next/dynamic";
import Button from "@material-ui/core/Button";
import renderHTML from "react-render-html";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const Styles = styled.div`
  margin-top: 2%;
  width: ${props => (props.story ? "90%" : "100%")};
`;

const Frame = styled.div`
  border: 1px solid #c4c4c4;
  border-radius: 10px;
  padding: 0 2%;
  margin: 2% 0;
  .com {
    border-top: 1px solid #c4c4c4;
  }
`;

const Comments = styled.div`
  display: ${props => (props.display ? "block" : "none")};
  border: 1px solid #c4c4c4;
  border-radius: 10px;
  margin-bottom: 3%;
  padding: 2% 4%;
  p {
    font-size: 1.8rem;
    font-weight: bold;
  }
  .comment {
    margin: 2% 0;
    border-bottom: 1px solid #c4c4c4;
    padding-bottom: 2%;
  }
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  div {
    margin: 1% 0;
    font-size: 1.6rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`;

const Progress = styled.div`
  display: ${props => (props.display ? "flex" : "none")};
  flex-direction: row;
  justify-content: center;
  width: 100%;
  margin: 2% 0 2% 0;
`;

const StyledButton = withStyles({
  root: {
    margin: "1% 0",
    marginRight: "2%",
    fontSize: "1.6rem",
    textTransform: "none"
  }
})(Button);

const DynamicLoadedEditor = dynamic(import("../../editor/HoverEditor"), {
  loading: () => <p>...</p>,
  ssr: false
});

const Clause = props => {
  const [text, setText] = useState("");
  const [show, setShow] = useState(false);
  const [comments, setComments] = useState([]);
  const [idea, setIdea] = useState();
  const [checked, setChecked] = useState(false);
  const [progress, setProgress] = useState(false);

  const myCallback = dataFromChild => {
    setText(dataFromChild);
    props.getText(dataFromChild, props.index);
  };

  const checkIdea = async e => {
    if (!checked) {
      setProgress(true);
      props.getDraft(text, props.index);
      setShow(true);
      let data = {
        answer: text,
        model: props.sample,
        tags_arguments: props.tags_arguments,
        tags_intro: props.tags_intro
      };
      // https://dry-plains-91452.herokuapp.com
      // http://localhost:5000/
      const r = await fetch("http://localhost:5000/text", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(res => {
          setIdea(res);
          setProgress(false);
        })
        .catch(err => console.log(err));
    } else {
      alert("Вы уже проверили этот пункт!");
    }
    // setChecked(true);
  };

  const checkStructure = async e => {
    if (!checked) {
      setProgress(true);
      props.getDraft(text, props.index);
      setShow(true);
      let data = {
        answer: text,
        model: props.sample,
        tags_arguments: props.tags_arguments,
        tags_intro: props.tags_intro
      };
      // https://dry-plains-91452.herokuapp.com
      // http://localhost:5000/
      const r = await fetch("http://localhost:5000/text", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(res => {
          console.log(res);
          // setComments(res);
          setProgress(false);
        })
        .catch(err => console.log(err));
    } else {
      alert("Вы уже проверили этот пункт!");
    }
    setChecked(true);
  };

  const { index, total, getNumber, commentary, story } = props;
  return (
    <Styles size={story}>
      <div>
        {" "}
        Пункт {index}. {renderHTML(commentary)}
      </div>
      <Frame>
        <DynamicLoadedEditor getEditorText={myCallback} />
      </Frame>
      <Comments display={show}>
        <p>Комментарии:</p>
        <Progress display={progress}>
          <CircularProgress />
        </Progress>
        {idea && console.log(idea.intro.final)}
        {idea && (
          <>
            {idea.intro.final > 0.55 && idea.intro.final !== null ? (
              <p>
                Основная идея абзаца в первом предложении указана правильно!
              </p>
            ) : (
              <p>
                Основная идея абзаца в первом предложении указана неправильно!
                Доработайте свой ответ, используя ключевые словав ниже в
                качестве подсказок.
              </p>
            )}

            {idea.intro.tags.length > 0 &&
              idea.intro.tags.map(el => <li>{el}</li>)}
          </>
        )}
        {idea && (
          <>
            {idea.args.final > 0.55 && idea.args.final !== null ? (
              <p>Аргументация главной идеи абзаца дана верно!</p>
            ) : (
              <p>
                Аргументация главной идеи абзаца дана неверно! Доработайте свой
                ответ, используя ключевые словав ниже в качестве подсказок.
              </p>
            )}

            {idea.args.tags.length > 0 &&
              idea.args.tags.map(el => <li>{el}</li>)}
          </>
        )}
        {comments.map(com => {
          if (Object.keys(com)[0] === "spellcheck") {
            return Object.values(com)[0].length > 0 ? (
              <>
                <div className="comment">
                  Возможно, вы допустили ошибки в следующих словах:{" "}
                  {Object.values(com)[0].map(el => (
                    <li>{el}</li>
                  ))}
                </div>
              </>
            ) : (
              <div className="comment">Мы не нашли ошибок в словах.</div>
            );
          } else if (Object.keys(com)[0] === "enough_keywords") {
            return Object.values(com)[0] === false ? (
              <>
                {/* <div className="comment">
                  Используйте больше специальных выражений:{" "}
                  {keywords.map(el => (
                    <li>{el}</li>
                  ))}
                </div> */}
              </>
            ) : (
              <div className="comment">
                Вы используете юридическую лекссику! Молодец!
              </div>
            );
          } else if (Object.keys(com)[0] === "style") {
            return Object.values(com)[0].length > 0 ? (
              <>
                <div className="comment">
                  Обратите внимание на следующие стилистические недостатки:{" "}
                  {Object.values(com)[0].map(el => (
                    <li>{el.reason}</li>
                  ))}
                </div>
              </>
            ) : (
              <div className="comment">Мы не нашли стилистических проблем.</div>
            );
          } else if (Object.keys(com)[0] === "paragraph") {
            return Object.values(com)[0].length > 0 ? (
              <>
                <div>
                  Обратите внимание на следующие структурные недостатки:{" "}
                  {Object.values(com)[0].map(el => (
                    <li>
                      {el.comment} Sentence number: {el.sentence_number}
                    </li>
                  ))}
                </div>
              </>
            ) : (
              <div>Мы не нашли структурных проблем.</div>
            );
          }
        })}
      </Comments>
      <Buttons>
        <StyledButton onClick={checkStructure}>
          Проверить структуру
        </StyledButton>
        <StyledButton onClick={checkIdea}>Проверить смысл</StyledButton>
        {index !== total ? (
          <StyledButton onClick={e => getNumber(index + 1)}>
            Дальше
          </StyledButton>
        ) : (
          <div>Конец документа</div>
        )}
      </Buttons>
    </Styles>
  );
};

Clause.propTypes = {
  document: PropTypes.string.isRequired,
  key: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  commentary: PropTypes.string.isRequired,
  sample: PropTypes.string.isRequired,
  tags_intro: PropTypes.array.isRequired,
  tags_arguments: PropTypes.array.isRequired,
  getNumber: PropTypes.func,
  total: PropTypes.number.isRequired,
  getText: PropTypes.func,
  getDraft: PropTypes.func,
  story: PropTypes.bool
};

export default Clause;
