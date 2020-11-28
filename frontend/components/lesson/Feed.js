import React, { useState, useEffect } from "react";
import styled from "styled-components";
import _ from "lodash";
import MobileStepper from "@material-ui/core/MobileStepper";
import { makeStyles } from "@material-ui/core/styles";

const Styles = styled.div`
  display: flex;
  flex-direction: column;
  img {
    width: 30px;
    color: black;
    cursor: pointer;
  }
  .b {
    background: yellow;
    /* padding-right: 20px; */
    width: 30px;
  }
`;

const Block = styled.div`
  min-height: 50vh;
  display: ${(props) => (props.show === "final" ? "none" : "flex")};
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const Stepper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;
`;

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 600,
    width: 600,
    [theme.breakpoints.down("sm")]: {
      width: 315,
    },
    // flexGrow: 1,
    background: "white",
    margin: "2% 0",
  },
  progress: {
    width: "100%",
    // [theme.breakpoints.down("sm")]: {
    //   width: 100,
    // },
  },
  textSizeSmall: {
    fontSize: "1.7rem",
    [theme.breakpoints.down("sm")]: {
      fontSize: "1.5rem",
    },
    background: "yellow",
    textTransform: "none",
    fontFamily: "Montserrat",
  },
}));

const Feed = (props) => {
  const [show, setShow] = useState([]);
  const [num, setNum] = useState(0);

  const classes = useStyles();

  const move = async (e) => {
    if (props.components.length > num + 1) {
      const data = await setNum(num + 1);
      //   console.log(document.getElementsByClassName("final")[0].previousSibling);
      if (props.components.length > num + 2) {
        var my_element = document.getElementsByClassName("final")[0]
          .previousSibling;
        // console.log(my_element, props.components, num + 2);
        my_element.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      } else if (props.components.length === num + 2) {
        var my_element = document.getElementsByClassName("no")[
          document.getElementsByClassName("no").length - 1
        ];
        my_element.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }
    }
  };
  return (
    <Styles>
      {props.components.slice(0, num + 2).map((c, i) => (
        <Block
          show={i === num + 1 ? "final" : "no"}
          className={i === num + 1 ? "final" : "no"}
        >
          {c}
          {console.log(i, num)}
          {props.components.length > num + 1 && i === num && (
            <div className="button" onClick={(e) => move()}>
              <img src="../../static/down-arrow.svg" />
            </div>
          )}
        </Block>
      ))}
      <Stepper>
        <MobileStepper
          variant="progress"
          steps={props.components.length}
          position="static"
          activeStep={num}
          classes={{
            root: classes.root, // class name, e.g. `classes-nesting-root-x`
            progress: classes.progress, // class name, e.g. `classes-nesting-label-x`
          }}
        />
        <div>
          {num + 1} из {props.components.length}
        </div>
      </Stepper>
    </Styles>
  );
};

export default Feed;
