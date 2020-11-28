import React, { Component } from "react";
import { useUser } from "../User";
import styled from "styled-components";
import ChallengesList from "./courseLists/ChallengesList";

const Container = styled.div`
  padding: 2% 4%;
  border: none;
`;

const Communities = (props) => {
  const me = useUser();
  return (
    <Container>
      <ChallengesList me={me} />
    </Container>
  );
};

export default Communities;
