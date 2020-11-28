import { useState, useEffect } from "react";

const NumericTool = (props) => {
  const [value, setValue] = useState(props.value);
  const [checked, setChecked] = useState(false);
  return (
    <div>
      {props.name}{" "}
      <input
        type="number"
        onChange={(e) => {
          props.getValue({ value: parseInt(e.target.value), id: props.num });
          setValue(e.target.value);
        }}
        defaultValue={value}
      />
    </div>
  );
};

export default NumericTool;
