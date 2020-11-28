import React from "react";

const org = (props) => {
  return (
    <>
      <OrganizationPage name={props.query.name} />
    </>
  );
};

export default org;
