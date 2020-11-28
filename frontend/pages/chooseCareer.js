import React, { Component } from "react";
import ChooseCareer from "../components/career/ChooseCareer";
import { useUser } from "../components/User";

class chooseCareer extends Component {
  render() {
    return <User>{({ data: { me } }) => <ChooseCareer me={me} />}</User>;
  }
}

export default chooseCareer;
