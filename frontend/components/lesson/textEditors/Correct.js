import React, { useEffect } from "react";
import renderHTML from "react-render-html";

const Correct = (props) => {
  useEffect(() => {
    const elements = document
      .getElementsByClassName("correct")[0]
      .querySelectorAll("#id");
    Array.from(elements).map((el) => {
      el.innerHTML = el.getAttribute("data");
    });
  }, []);
  return <div className="correct">{renderHTML(props.text)}</div>;
};

export default Correct;
