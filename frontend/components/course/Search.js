import React, { useState } from "react";
import styled from "styled-components";
import ShownCourses from "./courseLists/ShownCourses";
import { withTranslation } from "../../i18n";

const Styles = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Block = styled.div`
  border: 1px solid #e7e9ea;
  box-sizing: border-box;
  border-radius: 5px;
  width: 70%;
  padding: 2% 4%;
  margin-top: 3%;
  min-height: 400px;
  box-shadow: 0 6px 15px 0 rgba(85, 92, 107, 0.15);
  .title {
    font-size: 2.4rem;
    font-weight: bold;
  }
  @media (max-width: 900px) {
    width: 100%;
    margin-top: 0;
    padding-top: 25px;
    border-radius: 0;
    .title {
      font-size: 2rem;
      line-height: 1.4;
    }
  }
`;

const Group = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 55px;
  margin-top: 3%;
  justify-content: space-between;
  @media (max-width: 900px) {
    flex-direction: column;
    height: auto;
    margin: 20px 0;
  }
  button {
    background: #f03e64;
    border: 1px solid #c61f4a;
    box-sizing: border-box;
    border-radius: 5px;
    color: white;
    width: 20%;
    font-family: Montserrat;
    font-size: 1.6rem;
    cursor: pointer;
    outline: none;
    transition: background-color 0.15s ease-in-out;
    &:hover {
      background: #c31c40;
    }
    a {
      color: white;
    }
    @media (max-width: 900px) {
      padding: 4% 2%;
      width: 100%;
      margin-top: 4%;
    }
  }
`;

const Table = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-right: 2%;
  border: 1px solid #d5dadb;
  box-sizing: border-box;
  border-radius: 5px;
  select {
    background: white;
    -webkit-appearance: none;
    font-family: Montserrat;
    outline: 0;
    cursor: pointer;
    line-height: 1.5;
    padding: 0.6em 1.4em 0.5em 0.8em;
    background-color: #fff;
    border: none;
    font-size: 1.6rem;
    background: url(data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0Ljk1IDEwIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6I2ZmZjt9LmNscy0ye2ZpbGw6IzQ0NDt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPmFycm93czwvdGl0bGU+PHJlY3QgY2xhc3M9ImNscy0xIiB3aWR0aD0iNC45NSIgaGVpZ2h0PSIxMCIvPjxwb2x5Z29uIGNsYXNzPSJjbHMtMiIgcG9pbnRzPSIxLjQxIDQuNjcgMi40OCAzLjE4IDMuNTQgNC42NyAxLjQxIDQuNjciLz48cG9seWdvbiBjbGFzcz0iY2xzLTIiIHBvaW50cz0iMy41NCA1LjMzIDIuNDggNi44MiAxLjQxIDUuMzMgMy41NCA1LjMzIi8+PC9zdmc+)
      no-repeat 95% 50%;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    /* and then whatever styles you want*/
    height: 30px;
    width: 100px;
    padding: 5px;
  }
  option {
    font-family: Montserrat;
  }
  .subject {
    padding-left: 1%;
    flex-basis: 33%;
    width: 95%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-right: 1px solid #d5dadb;
  }
  .level {
    flex-basis: 33%;
    display: flex;
    width: 95%;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 900px) {
    flex-direction: column;
    width: 100%;
    .subject {
      border-right: none;
      border-bottom: 1px solid #d5dadb;
      padding: 2% 1%;
      width: 100%;
      align-items: flex-start;
      img {
        fill: red;
        background: yellow;
      }
    }
    .level {
      padding: 2% 1%;
      width: 100%;
      align-items: flex-start;
    }
  }
  select {
    text-align: left;
    width: 100%;
  }
`;

const Proof = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-column-gap: 30px;
  grid-row-gap: 30px;
  margin-top: 3%;
  font-size: 1.5rem;
  .div1 {
    grid-area: 1 / 1 / 2 / 2;
    display: flex;
    max-height: 140px;
    min-height: 70px;
    flex-direction: row;
  }
  .div2 {
    grid-area: 1 / 2 / 2 / 3;
    display: flex;
    max-height: 140px;
    flex-direction: row;
  }
  .div3 {
    grid-area: 2 / 1 / 3 / 2;
    display: flex;
    max-height: 140px;
    flex-direction: row;
  }
  .div4 {
    grid-area: 2 / 2 / 3 / 3;
    display: flex;
    max-height: 140px;
    flex-direction: row;
  }
  img {
    width: 50px;
    margin-right: 20px;
  }
  .text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-left: 1%;
  }

  @media (max-width: 900px) {
    display: flex;
    flex-direction: column;
    .div1,
    .div2,
    .div3,
    .div4 {
      margin-bottom: 25px;
    }
  }
`;

const Search = (props) => {
  const [topic, setTopic] = useState("");
  const [teacher, setTeacher] = useState("");
  const [level, setLevel] = useState("");

  const move = () => {
    var my_element = document.getElementById("section1");

    my_element.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  };
  return (
    <Styles>
      <Block>
        <div className="title">{props.t("header")}</div>
        <Group>
          <Table>
            <div className="subject">
              <select onChange={(e) => setTopic(e.target.value)}>
                <option value="Корпоративное право">Корпоративное право</option>
                <option value="Английский">Юридический английский</option>
                <option value="Налоговое право">Налоговое право</option>
                <option value="Гражданское право">Гражданское право</option>
              </select>
            </div>
            <div className="subject">
              <select onChange={(e) => setTeacher(e.target.value)}>
                <option value="Teacher">{props.t("tutor")}</option>
                <option value="NoTeacher">{props.t("sp")}</option>
              </select>
            </div>
            <div className="level">
              <select onChange={(e) => setLevel(e.target.value)}>
                <option value="All">Для всех</option>
                <option value="Student">Для студента</option>
                <option value="Junior">Для младших юристов</option>
                <option value="Senior">Для юристов</option>
              </select>
            </div>
          </Table>
          <button onClick={(e) => move()}>
            <a> {props.t("button")}</a>
          </button>
        </Group>
        <Proof>
          <div className="div1">
            <img src="../../static/student.svg" />
            <div className="text">
              <div> {props.t("bullet1")}</div>
            </div>
          </div>
          <div className="div2">
            <img src="../../static/information.svg" />
            <div className="text">
              <div>{props.t("bullet3")}</div>
            </div>
          </div>
          <div className="div3">
            <img src="../../static/teacher.svg" />
            <div className="text">
              <div>{props.t("bullet2")}</div>
            </div>
          </div>
          <div className="div4">
            <img src="../../static/notebook.svg" />
            <div className="text">
              <div>{props.t("bullet4")}</div>
            </div>
          </div>
        </Proof>
      </Block>
      <div id="section1"></div>
      <ShownCourses
        topic={topic}
        level={level}
        teacher={teacher}
        me={props.me}
      />
    </Styles>
  );
};

export default withTranslation("search")(Search);
