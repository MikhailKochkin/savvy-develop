import React from "react";
import styled from "styled-components";

const Header = styled.div`
  display: flex;
  flex-direction: row;
  width: 50%;
  padding: 2%;
  font-weight: bold;
  /* color: #696969; */
  .text {
    flex-basis: 50%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
  }
  .img {
    flex-basis: 50%;
  }
`;

const Text = styled.div`
  width: 50%;
  text-align: left;
  padding: 2%;
  /* color: #696969; */
  div {
    margin-bottom: 2%;
    padding-top: 0;
  }
  .bold {
    font-size: 1.8rem;
    margin-bottom: 2%;
  }
`;

const Img = styled.img`
  width: 50%;
`;

const HowTo = () => {
  return (
    <>
      <Header>
        <div className="text">
          О чем надо подумать перед созданием онлайн курса?
        </div>
        <div className="text">
          <Img src="../../static/teach.svg" />
        </div>
      </Header>
      <Text>
        <div className="bold">1. Найти тему курса</div>
        <div>
          <div>
            Курсы нужны людям, если они решают какую-то конкретную проблему.
            Лучше, если это будет не философская проблема саморазвития, а
            конкретная физическая проблема: сдача экзаменов, новая работа,
            решение проекта на работе, получение повышения на работе.
          </div>{" "}
          <div>
            Также надо понять, какое количество людей сталкивается с такой
            проблемой. Это число должно быть больше 500 или даже 1000, иначе мы
            просто не донесем этот курс до широкой аудитории.{" "}
          </div>
          <div>Так что попробуйте ответить на эти вопросы:</div>
          <div>1. Какую проблему решает ваш курс?</div>
          <div>
            2. Какое количество юристов сталкивается с этой проблемой по вашим
            оценкам?
          </div>
          <div>
            <i>
              Старайтесь создавать курсы, которые будут интересны сотням юристов
              и которые помогут им решать практические задачи. Отразите тему
              курса в его названии.
            </i>
          </div>
        </div>
      </Text>
      <Text>
        <div className="bold">2. Определить цель / цели вашего курса</div>
        <div>
          <div>
            Целью может быть полноценная рабочая задача – “структурировать
            сделку по выдаче кредита”. Или отдельный блок знаний. “Особенности
            работы налоговых органов в России”.
          </div>{" "}
          <div>
            Также надо понять, какое количество людей сталкивается с такой
            проблемой. Это число должно быть больше 500 или даже 1000, иначе мы
            просто не донесем этот курс до широкой аудитории.{" "}
          </div>
          <div>
            Старайтесь формулировать цель курса через “глагол”. Структурировать,
            определить, научиться, понять и так далее. Такая постановка цели
            сделает её понятной для учеников.
          </div>
          <div>
            <i>Отразите цель курса в его описании.</i>
          </div>
        </div>
      </Text>
      <Text>
        <div className="bold">
          3. Определить способы достижения этой цели / этих целей{" "}
        </div>
        <div>
          <div>
            Этапы предполагают последовательный набор того, что надо изучить (то
            есть получить знания) и того, чему надо научиться (навыки). Можете
            дать их в виде списка.
          </div>{" "}
          <div>
            <i>
              Из знаний и навыков можно сделать уроки. В зависимости от
              сложности материала в одном уроке можно или рассмотреть несколько
              “знаний” и навыков, или посвятить все время только одному “знанию”
              или навыку.
            </i>
          </div>
        </div>
      </Text>
    </>
  );
};

export default HowTo;
