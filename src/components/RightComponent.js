import React from "react";

import { IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

export function RightComponent(props) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <div style={{ padding: "8px", marginLeft: "5px" }}>{props.name}</div>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        id={props.url}
        onClick={(obj) => {
          props.removeRight(obj.target.id);
        }}
      >
        <DeleteIcon />
      </IconButton>
    </div>
  );
}
