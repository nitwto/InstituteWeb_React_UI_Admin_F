import React, { useState } from "react";

import { Collapse } from "@material-ui/core";
import { Alert } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";

export default function AlertComponent(props) {
  const [showAlert, setShowAlert] = useState(true);

  return (
    <Collapse in={showAlert}>
      <Alert
        severity={props.type}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => {
              setShowAlert(false);
            }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        {props.text}
      </Alert>
    </Collapse>
  );
}
