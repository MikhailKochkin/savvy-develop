import React, { useEffect, useState } from "react";
import styled from "styled-components";
import renderHTML from "react-render-html";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import DeleteSingleConstruction from "../../delete/DeleteSingleConstructor";

const Styles = styled.div`
  border: 1px solid #c4c4c4;
  border-radius: 10px;
  margin-right: 3%;
  margin-bottom: 4%;
  background: white;
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
    opacity: 0;
    transition: opacity 0ms ease-out;
  }
  .box {
    padding: 0 15px;
    p {
      margin-bottom: ;
    }
  }
  .number {
    width: 100%;
    border-radius: 10px 10px 0 0;
    padding: 0 15px;
    background: #edefed;
    margin-bottom: 3%;
  }
  button {
    margin-bottom: 14px;
  }
`;

const Box = (props) => {
  const [open, setOpen] = useState(false);
  const [short, setShort] = useState();
  const [text, setText] = useState();
  useEffect(() => {
    let a = props.option.replace("<p>", "").replace("</p>", "").split(" ");
    let b;
    if (a.length <= 15) {
      b = a;
      setShort(true);
    } else {
      b = a.slice(0, 15);
      b.push(" ...");
      setShort(false);
    }
    setText(b.join(" "));
  }, [0]);
  return (
    <Styles>
      <div key={props.index} id={props.index + props.id}>
       <div className="number">{props.index + 1}. </div>
        <div className="box">{renderHTML(props.option)}</div>
      </div>
    </Styles>
  );
};

export default Box;
