import { useState } from "react";
import styled from "styled-components";
import Problem1 from "../components/Problem1";
import dynamic from "next/dynamic";

const DynamicProblem = dynamic(import(".././components/Problem2"), {
  loading: () => <p>...</p>,
  ssr: false,
});

const Styles = styled.div`
  @import url("https://fonts.googleapis.com/css?family=Montserrat:400,600&display=swap&subset=cyrillic");
  display: flex;
  flex-direction: column;
  width: 100%;
  line-height: 1.8;
  align-items: center;
  justify-content: center;
  font-family: "Montserrat", sans-serif;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 70%;
  align-items: center;
  justify-content: center;
  padding: 3%;
`;

const Intro = styled.div`
  div {
    margin: 30px 0;
  }
`;

const Data = () => {
  const [completed, setCompleted] = useState([false, false]);
  const intro = {
    header: "Симулятор принятия решений",
    text:
      "Авиакомпания S7 Airlines, которая в апреле—октябре 2020 года лидировала в России по количеству перевезенных пассажиров, с 1 марта 2021 года изменит оплату труда членов летных экипажей сроком на два года. Об этом говорится в письме гендиректора авиакомпании Вадима Клебанова, которое он отправил 18 ноября председателям профсоюзных организаций. У РБК есть копия письма, его подлинность подтвердил представитель авиакомпании.",
    question: "какие каналы продаж стоит использовать в нашем случае?",
  };
  const getData = (data, index) => {
    console.log(data, index);
    let new_completed = completed;
    new_completed[index] = true;
    console.log(new_completed);
    setCompleted([...new_completed]);
  };
  return (
    <Styles>
      <Container>
        <Intro>
          <h3>{intro.header}</h3>
          <div>{intro.text}</div>
          <div>
            <b>Примите решение: </b>
            {intro.question}
          </div>
        </Intro>
        <Problem1 getData={getData} index={0} />
        {/* <Problem2 getData={getData} index={1} /> */}
        <DynamicProblem getData={getData} index={1} />
        {!completed.includes(false) && <div>Задание выполнено!</div>}
      </Container>
    </Styles>
  );
};

export default Data;
