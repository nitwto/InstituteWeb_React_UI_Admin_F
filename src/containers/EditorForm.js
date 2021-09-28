import React, { useState } from "react";
import { useSelector } from "react-redux";

import AlertComponent from "../components/AlertComponent";

import {
  FormControl,
  Input,
  InputLabel,
  FormHelperText,
  Button,
} from "@material-ui/core";

export default function EditorForm(props) {
  const [url, setUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);

  let urlError = "";
  let urlErrorText = "";

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (true) {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.token}`,
        },
        body: JSON.stringify({ url }),
      };
      const response = await fetch(
        "http:///insti-web-backend.herokuapp.com/api/page/get",
        requestOptions
      );
      const data = await response.json();
      console.log(data);
      if (data.error) {
        if (response.status === 400) {
          props.addAlert(
            <AlertComponent
              type="error"
              text="Sorry, the given url doesn't exist or the server is down for a while."
            />
          );
        } else if (response.status === 403) {
          props.addAlert(
            <AlertComponent
              type="error"
              text="Sorry!! You are not authorized to access or edit the given page."
            />
          );
        }
      } else {
				props.handlePageChange(data);
        props.handleTab("PageEditor");
      }
    }
  };

  if (submitted && url === "") {
    urlError = true;
    urlErrorText = "Please enter a url";
  }

  const styles = {
    margin: "10px",
    width: "500px",
  };
  return (
    <React.Fragment>
      <h3>Please enter the url of page you want to edit.</h3>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "column",
          alignContent: "center",
        }}
      >
        <FormControl fullWidth={true} style={styles} required>
          <InputLabel htmlFor={"url"}>{"url"}</InputLabel>
          <Input
            id={"url"}
            aria-describedby="my-helper-text"
            error={urlError}
            value={url}
            onChange={(object) => setUrl(object.target.value)}
          />
          <FormHelperText id="my-helper-text">{urlErrorText}</FormHelperText>
        </FormControl>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            style={{ marginLeft: "10px" }}
            variant="contained"
            color="primary"
            onClick={onSubmit}
          >
            Extract Page
          </Button>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            style={{ marginLeft: "10px", marginTop: "10px" }}
            color="primary"
            onClick={() => {props.handleTab("NewPageForm")}}
          >
            Want to create a new page?
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
}
