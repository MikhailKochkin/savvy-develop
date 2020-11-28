import { useState } from "react";
import styled from "styled-components";
import NumericTool from "./NumericTool";
import { Line } from "react-chartjs-2";

const Styles = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 40px;
  width: 100%;
  button {
    width: 150px;
    margin: 20px 0;
  }
`;

const Data = styled.div`
  width: 40%;
`;

const Graphics = styled.div`
  width: 60%;
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

  const [means, setMeans] = useState([
    {
      id: "e",
      type: "controlled",
      name: "Google Adwords",
      value: 1,
    },
    {
      id: "f",
      type: "controlled",
      name: "Поисковая оптимизация",
      value: 1,
    },
  ]);

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
    console.log(-0.025 * Math.pow(p - 40, 2) + 40);
    let new_data = data;
    new_data.labels.push(index.toString());
    new_data.datasets[0].data.push(Number(((total * 100) / k).toFixed(2)));
    setData(new_data);
    console.log(new_data);
    setIndex(index + 1);
    if (total >= goal) {
      props.getData(true, props.index);
    }
  };

  return (
    <Styles>
      <Data>
        <p>
          Выручка от использования каналов:
          <br /> {Number(result.toFixed(2))}  $
          {result === k ? " Well done!" : null}
        </p>
        <div>
          Регулируйте расходы на каждый из каналов, чтобы найти оптимальное
          соотношение расходов на них.
        </div>
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
        {/* <button onClick={(e) => change()}>Change</button> */}
      </Data>
      <Graphics>
        <Line redraw={true} data={data} options={options} />
        {console.log(data.datasets[0].data)}
      </Graphics>
    </Styles>
  );
};

export default Simulator;
