import React from "react";
import styled from "styled-components";

const Styles = styled.div`
  /* background: #272c34;
  color: white; */

  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;
`;

const CodeMark = props => (
  <Styles>
    {/* <pre {...props.attributes}> */}
    <code>{props.children}</code>
    {/* </pre> */}
  </Styles>
);

export default CodeMark;
