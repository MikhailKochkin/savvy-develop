import React, { Component } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import styled from "styled-components";
import gql from "graphql-tag";
import { Mutation, Query } from "@apollo/client/react/components";

const SINGLE_COURSE_VISIT_QUERY = gql`
  query SINGLE_COURSE_VISIT_QUERY($coursePage: ID!, $student: ID!) {
    courseVisits(
      where: { coursePage: { id: $coursePage }, student: { id: $student } }
    ) {
      id
      visitsNumber
      student {
        id
      }
    }
  }
`;

const CREATE_COURSE_VISIT_MUTATION = gql`
  mutation CREATE_COURSE_VISIT_MUTATION($visitsNumber: Int, $coursePage: ID) {
    createCourseVisit(visitsNumber: $visitsNumber, coursePage: $coursePage) {
      id
    }
  }
`;

const UPDATE_COURSE_VISIT_MUTATION = gql`
  mutation UPDATE_COURSE_VISIT_MUTATION($id: ID!, $visitsNumber: Int) {
    updateCourseVisit(id: $id, visitsNumber: $visitsNumber) {
      id
    }
  }
`;

const CaseCard = styled.div`
  position: relative;
  margin: 2%;
  width: 295px;
  height: 310px;
  line-height: 1.2;
  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
  .title {
    font-size: 1.8rem;
    margin-bottom: 20px;
  }
  .name {
    font-size: 1.6rem;
    margin-bottom: 5px;
  }
  .company {
    font-size: 1.4rem;
  }
`;
const Box = styled.div`
  color: white;
  /* background: rgba(36, 36, 36, 0.75); */
  background: linear-gradient(270deg, rgba(46, 46, 46, 0.79) 0%, #2e2e2e 100%);
  width: 245px;
  height: 100%;
  position: absolute;
  bottom: 0px;
  left: 50px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  .content {
    height: 85%;
    width: 85%;
    display: flex;
    flex-direction: column;
    align-items: space-between;
    justify-content: space-between;
    img {
      width: 55px;
      height: 55px;
      border-radius: 50px;
    }
    .author {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .details {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-left: 5px;
    }
  }
  button {
    background: #00c3ff;
    border-radius: 20px;
    width: 100%;
    height: 35px;
    padding: 2%;
    border: none;
    color: white;
    font-family: Montserrat;
    font-size: 1.6rem;
    outline: 0;
    cursor: pointer;
    &:hover {
      background: #0195c2;
    }
  }
`;

export default class Course extends Component {
  state = {
    revealApplication: false,
    isOpen: false,
    auth: "signin",
  };
  static propTypes = {
    coursePage: PropTypes.object.isRequired,
  };

  toggleModal = (e) => {
    this.setState((prevState) => ({ isOpen: !prevState.isOpen }));
  };

  changeState = (dataFromChild) => {
    this.setState({
      auth: dataFromChild,
    });
  };

  render() {
    const { coursePage, id, me } = this.props;
    return (
      <CaseCard>
        <img src={coursePage.image} />
        <Box>
          <div className="content">
            <div>
              <div className="title">{coursePage.title}</div>
              <div className="author">
                <img src="https://sun9-38.userapi.com/c206824/v206824315/ea2be/dQYIqRjv6Ww.jpg" />
                <div className="details">
                  <div className="name">
                    {coursePage.user.name} {coursePage.user.surname}
                  </div>
                  <div className="company">BeSavvy App</div>
                </div>
              </div>
            </div>
            <div>
              {!me && (
                // <SignUpButton onClick={this.toggleModal}>Войти</SignUpButton>
                <Link
                  href={{
                    pathname: "/coursePage",
                    query: { id },
                  }}
                  // as={`/coursePage/${id}`}
                  // href={`/coursePage/${encodeURIComponent(id)}`}
                >
                  <a>
                    <button
                      onClick={() => {
                        console.log(0);
                      }}
                    >
                      Перейти3
                    </button>
                  </a>
                </Link>
              )}
              {me && (
                <Query
                  query={SINGLE_COURSE_VISIT_QUERY}
                  variables={{
                    coursePage: id,
                    student: me.id,
                  }}
                >
                  {({ data, error, loading }) => {
                    if (loading) return <p></p>;
                    if (error) return <p>Error: {error.message}</p>;

                    return (
                      <>
                        {data.courseVisits.length === 0 && (
                          <Mutation
                            mutation={CREATE_COURSE_VISIT_MUTATION}
                            variables={{
                              coursePage: id,
                              visitsNumber: 1,
                            }}
                            refetchQueries={() => [
                              {
                                query: SINGLE_COURSE_VISIT_QUERY,
                                variables: {
                                  coursePage: id,
                                  student: me.id,
                                },
                              },
                            ]}
                          >
                            {(createCourseVisit, { loading, error }) => {
                              return (
                                <>
                                  <>
                                    {me && coursePage && (
                                      <Link
                                        href={{
                                          pathname: "/coursePage",
                                          query: { id },
                                        }}
                                        prefetch
                                      >
                                        <a>
                                          <button
                                            onClick={() => {
                                              console.log(1);
                                              createCourseVisit();
                                            }}
                                          >
                                            Перейти2
                                          </button>
                                        </a>
                                      </Link>
                                    )}
                                  </>
                                </>
                              );
                            }}
                          </Mutation>
                        )}
                        {data.courseVisits.length > 0 && (
                          <Mutation
                            mutation={UPDATE_COURSE_VISIT_MUTATION}
                            variables={{
                              id: data.courseVisits[0].id,
                              visitsNumber:
                                data.courseVisits[0].visitsNumber + 1,
                            }}
                            refetchQueries={() => [
                              {
                                query: SINGLE_COURSE_VISIT_QUERY,
                                variables: {
                                  coursePage: id,
                                  student: me.id,
                                },
                              },
                            ]}
                          >
                            {(updateCourseVisit, { loading, error }) => {
                              return (
                                me &&
                                coursePage && (
                                  <Link
                                    href={{
                                      pathname: "/coursePage",
                                      query: { id },
                                    }}
                                    prefetch
                                  >
                                    <a>
                                      <button
                                        onClick={() => {
                                          console.log(2);
                                          updateCourseVisit();
                                        }}
                                      >
                                        Перейти1
                                      </button>
                                    </a>
                                  </Link>
                                )
                              );
                            }}
                          </Mutation>
                        )}
                      </>
                    );
                  }}
                </Query>
              )}
            </div>
          </div>
        </Box>
      </CaseCard>
    );
  }
}
