import { useState, useEffect } from "react";

const Tool = (props) => {
  const [value, setValue] = useState(props.value);
  const [checked, setChecked] = useState(false);
  //   useEffect(async (e) => {
  //     console.log(props.means[1].value);
  //     if (props.formula) {
  //       var b = props.means[1].value;
  //       var c = props.means[2].value;
  //       const new_value = eval(props.formula);
  //       setValue(new_value);
  //     }
  //   });
  return (
    <div>
      {props.name}{" "}
      <input
        onChange={(e) => {
          props.onChoose(props.num);
          setChecked(!checked);
        }}
        type="checkbox"
        id="scales"
        name="scales"
        checked={checked}
      />
      {/* <input
        type="number"
        disabled={props.type !== "controlled"}
        onChange={(e) => {
          props.getValue({ value: parseInt(e.target.value), id: props.num });
          setValue(e.target.value);
        }}
        value={value}
      /> */}
    </div>
  );
};

export default Tool;
