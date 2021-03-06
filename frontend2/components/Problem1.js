import { useState } from "react";
import styled from "styled-components";
import Tool from "./Tool";
import { Bar } from "react-chartjs-2";

const Styles = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 3%;
  padding: 3% 0;
  background: #f4f4f4;
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  width: 80%;
  button {
    width: 150px;
    margin: 20px 0;
  }
`;

const Data = styled.div`
  flex-basis: 40%;
  margin-right: 3%;
  border-radius: 5px;
  padding: 3%;
  background: #fff;
  .explain {
    font-weight: bold;
    margin-bottom: 10px;
  }
`;

const Graphics = styled.div`
  flex-basis: 60%;
  border-radius: 5px;
  padding: 3%;
  background: #fff;
  .explain {
    font-weight: bold;
  }
  .bar {
    /* width: 100%; */
  }
`;

const Result = styled.div`
  background: #27b353;
  color: white;
  width: 40%;
  text-align: center;
  padding: 2%;
  display: inline-block;
  border-radius: 15px;
`;

const Simulator = (props) => {
  const [goal, setGoal] = useState(200);
  const [result, setResult] = useState(0);
  const [chosenMeans, setChosenMeans] = useState([]);
  const [chosenMeans2, setChosenMeans2] = useState([]);
  const [availableFeedback, setAvailableFeedback] = useState([]);
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: "Данные по каналам продаж",
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        data: [],
      },
    ],
    options: {
      legend: {
        display: false,
      },
      scales: {
        xAxes: [
          {
            display: false,
            ticks: {
              min: 0,
            },
          },
        ],
        yAxes: [
          {
            display: false,
          },
        ],
      },
    },
  });
  const [means, setMeans] = useState([
    {
      id: "a",
      num: 0,
      type: "controlled",
      name: "Email-маркетинг",
      value: 20,
    },
    {
      id: "b",
      num: 1,
      type: "controlled",
      name: "СМИ и PR",
      value: 10,
    },
    {
      id: "c",
      num: 2,
      type: "controlled",
      name: "Поисковая оптимизация",
      value: 20,
    },
    {
      id: "d",
      num: 3,
      type: "controlled",
      name: "Google Adwords",
      value: 40,
    },
  ]);

  const [synergy, setSynergy] = useState([
    [0, -20, 30, 10],
    [-20, 0, -60, -60],
    [30, -60, 0, 40],
    [10, -60, 40, 0],
  ]);

  const feedback = [
    [
      "Email-маркетинг – работает, но его точно не хватит",
      "A и B Небольшой минус",
      "A и C Большой плюс",
      "A и D Небольшой плюс",
    ],
    [
      "A и B Небольшой минус",
      "Реклама в СМИ – работает сама по себе, но вредит в сочетании с чем-то еще",
      "B и C Очень большой минус",
      "Контекстная реклама плохо работает с рекламой в СМИ",
    ],
    [
      "A и C Большой плюс",
      "B и C Очень большой минус",
      "С – хорош, но его точно не хватит",
      "C и D Очень большой плюс",
    ],
    [
      "A и D Небольшой плюс",
      "Google Adwords плохо работает с рекламой в СМИ",
      "C и D Очень большой плюс",
      "Google Adwords в 2020 работает максимально эффективно",
    ],
  ];

  const onChoose = (id) => {
    if (!chosenMeans.includes(id)) {
      setChosenMeans([...chosenMeans, id]);
      setChosenMeans2([...chosenMeans2, means.find((m) => m.id == id)]);
    } else {
      setChosenMeans(chosenMeans.filter((el) => el !== id));
      setChosenMeans2(chosenMeans2.filter((m) => m.id !== id));
    }
  };

  const sum = () => {
    let val = 0;
    let arr_chosen = [];
    means.map((m) => {
      if (chosenMeans.includes(m.id)) {
        arr_chosen.push(m);
        return (val += m.value);
      }
    });
    let arr = [];
    let arr2 = [];
    let arr3 = [];
    let arr4 = [];
    chosenMeans2.map((c) => {
      arr2.push(c.name);
      arr3.push(c.value);
      console.log(feedback[c.num][c.num]);
      arr4.push(feedback[c.num][c.num]);
    });
    console.log(arr2, arr3);
    if (arr_chosen.length > 1) {
      var n = arr_chosen.length;
      var i, j;
      for (i = 0; i < n; i++) {
        for (j = i + 1; j < n; j++) {
          console.log(arr_chosen[i], arr_chosen[j]);
          arr.push([arr_chosen[i].num, arr_chosen[j].num]);
          arr2.push(`${arr_chosen[i].name} & ${arr_chosen[j].name}`);
          arr3.push(synergy[arr_chosen[i].num][arr_chosen[j].num]);
          arr4.push(feedback[arr_chosen[i].num][arr_chosen[j].num]);
        }
      }
    }
    arr.map((a) => {
      console.log((val += synergy[a[0]][a[1]]));
      return (val += synergy[a[0]][a[1]]);
    });
    setResult(val);

    let new_data = data;
    new_data.labels = arr2;
    new_data.datasets[0].data = arr3;
    setData(new_data);
    setAvailableFeedback(arr4);
    console.log(arr4);

    if (val >= goal) {
      props.getData(true, props.index);
    }
  };
  return (
    <Styles>
      <Container>
        <Data>
          <div className="explain">Данные:</div>
          <div>
            В этом сезоне это уже вторая очная встреча команд. Первый матч
            проходил на стадии 1/8 финала Кубка английской лиги. Встреча
            проходила 29 сентября на стадионе «Тоттенхэм Хотспур» и завершилась
            победой «шпор» (1:1, 5:4 по пенальти).
          </div>
          <div className="explain">Инструменты:</div>
          {means.map((el) => (
            <Tool
              key={el.id}
              num={el.id}
              type={el.type}
              name={el.name}
              value={el.value}
              means={means}
              formula={el.formula ? el.formula : null}
              onChoose={onChoose}
            />
          ))}
          <button onClick={(e) => sum()}>Считать</button>
          <br />

          {result >= goal ? <Result>Верно</Result> : null}
        </Data>
        <Graphics>
          <div className="explain">Результаты:</div>
          <p> Общая ценность инструментов: {result}</p>
          <Bar
            data={data}
            width={100}
            height={50}
            options={{
              maintainAspectRatio: false,
              legend: {
                display: true,
              },
              scales: {
                xAxes: [{ display: true }],
                yAxes: [
                  {
                    display: true,
                    ticks: {
                      beginAtZero: true,
                    },
                  },
                ],
              },
            }}
          />
          <div className="explain">Инсайты:</div>
          {availableFeedback.length > 0 &&
            availableFeedback.map((a) => <li>{a}</li>)}
        </Graphics>
      </Container>
    </Styles>
  );
};

export default Simulator;
