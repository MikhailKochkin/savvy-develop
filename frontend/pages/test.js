import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
const Styles = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  margin: 10% 0;
  width: 60%;
  table {
    border-collapse: collapse;
  }

  td,
  th {
    border: 1px solid #999;
    padding: 0.5rem;
    text-align: left;
  }
  input {
    border: none;
    outline: 0;
  }
`;

const test = () => {
  const [options, setOptions] = useState([]);
  const [newOption, setNewOption] = useState("");
  const [synergy, setSynergy] = useState("a");
  const synergyRef = useRef(synergy);

  const change = (e) => {
    let synergy_copy = synergyRef.current;
    synergy_copy[e.target.getAttribute("row")][
      e.target.getAttribute("column")
    ] = e.target.value;
    synergy_copy[e.target.getAttribute("column")][
      e.target.getAttribute("row")
    ] = e.target.value;
    let id = `${e.target.getAttribute("column")}${e.target.getAttribute(
      "row"
    )}`;
    let el = document.getElementById(id);
    el.value = e.target.value;
    setSynergy(synergy_copy);
    synergyRef.current = synergy_copy;
  };

  const createBox = () => {
    let box = [];
    options.map((o) => {
      let new_arr = new Array(options.length).fill(0);
      box.push(new_arr);
    });
    box.forEach((o, index1) => {
      return o.forEach((c, index2, array) => {
        array[index2] = [index1, index2];
      });
    });
    setSynergy(box);
    synergyRef.current = box;
    return box;
  };

  const createTable = (box) => {
    // 1. initiate table
    let table = document.createElement("table");
    // 2. insert top row with options names
    table.insertRow();
    ["", ...options].map((option) => {
      let newCell1 = table.rows[0].insertCell();
      newCell1.innerText = option;
    });
    // 3. populate table with cells for numbers
    box.map((row, index) => {
      // 3.1. Insert a new row element into the table element
      table.insertRow();
      // 3.2. Insert the value of the first column
      let newCellLast = table.rows[table.rows.length - 1].insertCell();
      newCellLast.innerText = options[index];
      // 3.3. Iterate over every index(cell) in each array(row)
      row.map((cell) => {
        let newCell = table.rows[table.rows.length - 1].insertCell();
        newCell.setAttribute("row", cell[0]);
        newCell.setAttribute("column", cell[1]);

        let input_el = document.createElement("input");
        input_el.setAttribute("row", cell[0]);
        input_el.setAttribute("column", cell[1]);
        input_el.setAttribute("id", `${cell[0]}${cell[1]}`);

        if (cell[0] == cell[1]) {
          input_el.value = 0;
          let synergy_copy = synergyRef.current;
          synergy_copy[cell[0]][cell[1]] = 0;
          setSynergy(synergy_copy);
          synergyRef.current = synergy_copy;
        }
        input_el.addEventListener("input", change);
        newCell.appendChild(input_el);
      });
    });
    // 4. append the compiled table to the DOM
    let el = document.getElementById("table");
    el.after(table);
  };
  return (
    <Styles>
      <Container>
        <div>Create decision maker!</div>
        <div>Option created:</div>
        <div>
          {options.map((o, i) => (
            <li key={i + "sdfsdf"}>{o}</li>
          ))}
        </div>
        <div>
          <input
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
          />
        </div>
        <button
          onClick={(e) => {
            setOptions([...options, newOption]), setNewOption("");
          }}
        >
          Create new option
        </button>
        <button
          onClick={(e) => {
            console.log(synergy);
          }}
        >
          show state
        </button>
        <button
          onClick={async (e) => {
            let box = await createBox();
            let table = createTable(box);
          }}
        >
          Generate matrix
        </button>
        <div id="table"></div>
      </Container>
    </Styles>
  );
};

export default test;
