import React from "react";

export default function PageEditorComponent(props) {
  const { title, url } = props.pageDetails;
  return (
    <React.Fragment>
      <h2>{title}</h2>
    </React.Fragment>
  );
}
