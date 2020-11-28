import React, { useState } from "react";
import styled from "styled-components";
import LineTo from "react-lineto";

const Styles = styled.div`
  margin-right: 40px;
  display: flex;
  flex-direction: row;
  width: 1000px;
  /* overflow: auto; */
  overflow: ${(props) => (props.id === "first" ? "auto" : "visible")};
`;

const Head = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  .but {
    height: 25px;
    width: 25px;
    margin: 0 10px;
  }
`;

const Nodes = styled.div`
  display: flex;
  flex-direction: column;
`;

const Block = (props) => {
  const [reveal, setReveal] = useState(true);
  const open = (obj) => <Block obj={obj} />;
  const { obj } = props;
  return (
    <Styles id={obj.el.props.id} color={obj.el.props.color}>
      <Head>
        <button className="but" onClick={() => setReveal(!reveal)}>
          {reveal ? "-" : "+"}
        </button>
        {obj.el}
        {console.log(obj.el)}
      </Head>
      <Nodes>{reveal && obj.nodes.map((n) => open(n))}</Nodes>
    </Styles>
  );
};

export default Block;
