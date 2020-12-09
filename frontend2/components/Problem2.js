import { useState } from "react";
import styled from "styled-components";
import NumericTool from "./NumericTool";
import { Line } from "react-chartjs-2";

const Styles = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #f4f4f4;
  margin-bottom: 3%;
  padding: 3% 0;
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
  width: 40%;
  margin-right: 3%;
  border-radius: 5px;
  padding: 3%;
  background: #fff;
  .explain {
    font-weight: bold;
  }
`;

const Graphics = styled.div`
  width: 60%;
  border-radius: 5px;
  background: #fff;
  padding: 3%;
  .explain {
    font-weight: bold;
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
  // p * s = goal(h), это приложенные действия
  // y, k = максимальный результат при данных p s
  const [goal, setGoal] = useState(10000);
  const [result, setResult] = useState(100);
  const [index, setIndex] = useState(2);
  const k = 20400;
  const formula =
    "(-0.0002 * Math.pow(((-0.025 * Math.pow(p - 40, 2) + 40) * s) - goal, 2)) + k";
  const [data, setData] = useState({
    labels: ["1"],
    datasets: [
      {
        label: "Эффективность рекламы в %",
        data: [0],
        fill: true,
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgba(255, 99, 132, 0.2)",
      },
    ],
  });
  const [means, setMeans] = useState([
    {
      id: "e",
      name: "Google Adwords",
      value: 1,
    },
    {
      id: "f",
      name: "Поисковая оптимизация",
      value: 1,
    },
  ]);

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  const getValue = (data) => {
    let new_means = means;
    let mean = new_means.find((m) => m.id == data.id);
    mean.value = data.value;
    setMeans(new_means);
  };

  const sum = () => {
    let p = means[0].value;
    let s = means[1].value;
    let total = eval(formula);
    setResult(total);
    let new_data = data;
    new_data.labels.push(index.toString());
    new_data.datasets[0].data.push(Number(((total * 100) / k).toFixed(2)));
    setData(new_data);
    setIndex(index + 1);
    if (total >= goal) {
      props.getData(true, props.index);
    }
  };

  return (
    <Styles>
      <Container>
        <Data>
          <div className="explain">Данные:</div>
          <div>
            Регулируйте расходы на каждый из каналов, чтобы найти оптимальное
            соотношение расходов на них.
          </div>
          <div>
            Один из двух крупнейших поставщиков навигационных баз данных,
            компания Jeppesen, сообщила, что не сможет внести необходимые
            изменения до начала декабря по 49 российским аэродромам. В свою
            очередь в Госкорпорации по организации воздушного движения (ОрВД)
            сообщали, что новые данные по более чем 30 аэропортам не появятся до
            30 декабря.
          </div>
          <div className="explain">Инструменты:</div>
          {means.map((el) => (
            <NumericTool
              key={el.id}
              num={el.id}
              type={el.type}
              name={el.name}
              value={el.value}
              means={means}
              formula={el.formula ? el.formula : null}
              getValue={getValue}
            />
          ))}
          <button onClick={(e) => sum()}>Считать</button>
          <br />
          {result === k ? <Result>Верно</Result> : null}
        </Data>
        <Graphics>
          <div className="explain">Результаты:</div>
          <p>
            Выручка от использования каналов: {Number(result.toFixed(2))}  $
          </p>
          <div>
            <Line redraw={true} data={data} options={options} />
          </div>
        </Graphics>
      </Container>
    </Styles>
  );
};

export default Simulator;
