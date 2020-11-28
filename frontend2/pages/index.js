import Head from "next/head";
import styled from "styled-components";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useState } from "react";

const GET_BROS = gql`
  query GET_BROS {
    bros {
      id
      name
      points
    }
  }
`;

const DELETE_BRO = gql`
  mutation DELETE_BRO($id: Int) {
    deleteOneBro(id: $id) {
      id
    }
  }
`;

const CREATE_BRO = gql`
  mutation CREATE_BRO($name: String, $points: Int) {
    createOneBro(name: $name, points: $points) {
      id
    }
  }
`;

// const UPDATE_BRO = gql`
//   mutation UPDATE_BRO($id: String, $name: String, $points: Int) {
//     updateOneBro(data: { id: $id, name: $name, points: $points }) {
//       id
//     }
//   }
// `;

const UPDATE_BRO = gql`
  mutation UPDATE_BRO($id: Int, $name: String, $points: Int) {
    updateOneBro(id: $id, name: $name, points: $points) {
      id
    }
  }
`;

const Styles = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const Main = styled.div`
  width: 60%;
  margin: 50px 0;
  border: 1px solid black;
  padding: 3%;
  background: #1f1f1f;
  color: white;
  .delete {
    color: red;
    cursor: pointer;
    &:hover {
      color: darkred;
    }
  }
  .update {
    color: green;
    cursor: pointer;
    &:hover {
      color: darkgreen;
    }
  }
`;
const Footer = styled.div`
  text-align: center;
  width: 60%;
  img {
    height: 30px;
  }
  a {
    font-size: 1.6rem;
    color: black;
    text-decoration: none;
  }
`;

const Home = () => {
  const [name, setName] = useState("");
  const [points, setPoints] = useState(0);
  const [reveal, setReveal] = useState(false);
  const [currentBro, setCurrentBro] = useState({
    id: "",
    name: "",
    points: 0,
  });

  const { loading, error, data } = useQuery(GET_BROS);
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;
  const [deleteOneBro] = useMutation(DELETE_BRO);
  const [createOneBro] = useMutation(CREATE_BRO);
  const [updateOneBro] = useMutation(UPDATE_BRO);
  console.log(data);
  return (
    <Styles>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main>
        <h3>My Bros:</h3>
        {data.bros.map((bro, i) => (
          <li key={i}>
            {`${bro.name} - ${bro.points} `}
            <span
              className="update"
              onClick={(e) => {
                e.preventDefault();
                setCurrentBro({
                  id: bro.id,
                  name: bro.name,
                  points: bro.points,
                });
                setReveal(true);
              }}
            >
              Update Bro
            </span>{" "}
            <span
              className="delete"
              onClick={(e) => {
                e.preventDefault();
                deleteOneBro({
                  variables: { id: bro.id },
                  refetchQueries: [{ query: GET_BROS }],
                });
              }}
            >
              Delete Bro
            </span>
          </li>
        ))}
        {reveal && currentBro !== null && (
          <>
            <h3>Update Bro:</h3>
            <input
              className="name"
              type="text"
              name="name"
              placeholder="Bro name"
              required
              defaultValue={currentBro.name}
              onChange={(e) => {
                let cBro = currentBro;
                cBro.name = e.target.value;
                console.log(cBro);
                return setCurrentBro(cBro);
              }}
            />
            <input
              className="points"
              type="number"
              name="points"
              placeholder="Bro points"
              required
              defaultValue={currentBro.points}
              onChange={(e) => {
                let cBro = currentBro;
                cBro.points = parseInt(e.target.value);
                console.log(cBro);
                return setCurrentBro(cBro);
              }}
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                updateOneBro({
                  variables: {
                    id: currentBro.id,
                    name: currentBro.name,
                    points: currentBro.points,
                  },
                  refetchQueries: [{ query: GET_BROS }],
                });
                setReveal(false);
              }}
            >
              Save
            </button>
          </>
        )}
        <h3>New Bro:</h3>
        <input
          className="name"
          type="text"
          name="name"
          placeholder="Bro name"
          required
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="points"
          type="number"
          name="points"
          placeholder="Bro points"
          required
          onChange={(e) => setPoints(parseInt(e.target.value))}
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            createOneBro({
              variables: { name, points },
              refetchQueries: [{ query: GET_BROS }],
            });
          }}
        >
          Create
        </button>
      </Main>

      <Footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by <img src="/vercel.svg" alt="Vercel Logo" />
        </a>
      </Footer>
    </Styles>
  );
};

export default Home;
