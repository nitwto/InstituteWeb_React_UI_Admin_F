import React from "react";

import { Button, Dialog, DialogActions, DialogTitle } from "@material-ui/core";

export default function AlertDialogComponent(props) {

  return (
    <div>
      <Dialog
        open={props.openDialog}
        onClose={() => {props.onDisagree();}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
        <DialogActions>
          <Button onClick={() => {props.onDisagree();}}>Disagree</Button>
          <Button onClick={() => {props.onAgree();}} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
