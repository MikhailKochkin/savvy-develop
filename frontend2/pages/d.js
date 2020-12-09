import { useState } from "react";
import styled from "styled-components";
import Problem1 from "../components/Problem1";
import Problem2 from "../components/Problem2";

const Styles = styled.div`
  @import url("https://fonts.googleapis.com/css?family=Montserrat:400,600&display=swap&subset=cyrillic");
  display: flex;
  flex-direction: column;
  padding: 4% 0;
  width: 100%;
  line-height: 1.8;
  align-items: center;
  justify-content: center;
  font-family: "Montserrat";
`;

const Intro = styled.div`
  padding: 3%;
  width: 50%;
  .header {
    margin-bottom: 10px;
  }
`;

const Steps = styled.div`
  padding: 3%;
  width: 100%;
`;

const Data = () => {
  const [completed, setCompleted] = useState([false, false]);
  const intro = {
    header: "Симулятор принятия решений: поиск новых рекламных каналов",
    text: `Авиакомпания S11, которая в 2016-2020 годах лидировала в России по количеству 
  перевезенных пассажиров, с марта 2020 года начала терять пассажиров. 
  Безусловно, первичным фактором, оказавшим влияние на это падение, 
  стада пандемия. Тем не менее, еще одной причиной стал низкий уровень 
  использования онлайн инструментов рекламы и продаж. Теперь компания поняла, 
  что необходимо приоретизировать электронные инструменты торговли`,
    question:
      "какие каналы продаж стоит использовать S11 для повышения выручки компании?",
  };
  const getData = (data, index) => {
    let new_completed = completed;
    new_completed[index] = true;
    setCompleted([...new_completed]);
  };
  return (
    <Styles>
      <Intro>
        <div className="header">{intro.header}</div>
        <p>{intro.text}</p>
        <p>
          <b>Примите решение: </b>
          {intro.question}
        </p>
      </Intro>
      <Steps>
        <Problem1 getData={getData} index={0} />
        <Problem2 getData={getData} index={1} />
        {!completed.includes(false) && <div>Задание выполнено!</div>}
      </Steps>
    </Styles>
  );
};

export default Data;
