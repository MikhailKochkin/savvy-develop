import React, { Component } from "react";
import Search from "./Search";
import Landing from "./Landing";
import { useUser } from "../User";

const Courses = () => {
  const me = useUser();
  return (
    <>
      <Landing />
      <Search me={me} />
    </>
  );
};

export default Courses;
