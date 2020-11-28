import React, { Component } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import styled from "styled-components";
import { useUser } from "../User";
import MakePublic from "./MakePublic";
import DeleteCoursePage from "../delete/DeleteCoursePage";

const CaseCard = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  padding: 1%;
  width: 300px;
  line-height: 1.2;
  @media (max-width: 800px) {
    padding: 2%;
    button {
      padding: 4px 6px;
    }
  }
`;

const Img = styled.img`
  width: 100%;
  height: 200px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
`;

const Title = styled.p`
  font-size: 1.6rem;
  font-weight: bold;
  margin-top: 5%;
`;

const Button = styled.button`
  border: 1.5px solid #112a62;
  color: #112a62;
  padding: 5px 12px;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  font-weight: 400;
  border-radius: 5px;
  width: 135px;
  margin: 2px;
  cursor: pointer;
  outline: 0;
  &:active {
    border: 2px solid #112a62;
  }
`;
const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 0.5%;
`;

const Additional = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
`;

export default class Course extends Component {
  static propTypes = {
    coursePage: PropTypes.object.isRequired,
  };

  render() {
    const { coursePage, id } = this.props;
    let courseType;
    if (coursePage.courseType === "PUBLIC") {
      courseType = "Открытый";
    } else if (coursePage.courseType === "PRIVATE") {
      courseType = "Закрытый";
    }
    return (
      <User>
        {({ data: { me } }) => {
          return (
            <CaseCard>
              <Additional>
                <>
                  {coursePage.image && (
                    <Img src={coursePage.image} alt={coursePage.title} />
                  )}
                  <Title>
                    {coursePage !== null && (
                      <Link
                        href={{
                          pathname: "/coursePage",
                          query: { id },
                        }}
                      >
                        <a>{coursePage.title}</a>
                      </Link>
                    )}
                  </Title>
                  {/* <Description>{coursePage.description}</Description>
                        <Author>{coursePage.user.name}</Author> */}
                </>
                <>
                  <Buttons>
                    <Link
                      href={{
                        pathname: "/coursePage",
                        query: { id },
                      }}
                    >
                      <a>
                        <Button>Перейти</Button>
                      </a>
                    </Link>
                  </Buttons>
                </>
              </Additional>
            </CaseCard>
          );
        }}
      </User>
    );
  }
}
