import React, { useState } from "react";
import EditorJS from "@editorjs/editorjs";
import { tools } from "../constants/toolsForEditor";
import { Button } from "@material-ui/core";
import AlertComponent from "./AlertComponent";
import { API, TEST_API } from "../constants/extras";

export default function PageEditorComponent(props) {
  const [pageJson] = useState({ blocks: props.pageDetails.blocks });
  const editor = new EditorJS({
    readOnly: false,
    holder: "editorjs",
    tools: tools,
    data: pageJson,
  });

  const { title, url, path } = props.pageDetails;

  const onSaveHandler = async (outputData) => {
    let method = "PUT";
    let api = `${API}/page/update`;
    let successMessage = "The page has been updated successfully.";
    if (props.newPage) {
      method = "POST";
      api = `${API}/page/add`;
      successMessage = "New page has been added successfully";
    }

    const requestOptions = {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${props.token}`,
      },
      body: JSON.stringify({ ...outputData, title, url, path }),
    };
    const response = await fetch(api, requestOptions);
    const data = await response.json();
    if (data.error) {
      props.addAlert(
        <AlertComponent type="error" text="Sorry, there is no data." />
      );
    } else {
      props.addAlert(<AlertComponent type="success" text={successMessage} />);
      props.handleTab("EditorForm");
    }
  };

  const deleteHandler = async () => {
    if (!props.newPage) {
      let method = "DELETE";
      let api = `${TEST_API}/page/delete`;
      let successMessage = "The page has been deleted successfully.";
      const requestOptions = {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.token}`,
        },
        body: JSON.stringify({ url }),
      };
      const response = await fetch(api, requestOptions);
      var data = null;
      if(!response){
        data = await response.json();
      }
      if (!response || (data && data.error)) {
        props.addAlert(
          <AlertComponent type="error" text="Sorry, The page has not been deleted. Please try again later." />
        );
      } else {
        props.addAlert(<AlertComponent type="success" text={successMessage} />);
        props.handleTab("EditorForm");
      }
    } else {
      props.handleTab("EditorForm");
    }
  };

  return (
    <React.Fragment>
      <h2>{title}</h2>
      <div
        className="Editor"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ margin: "10px" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={(event) => {
              event.preventDefault();
              editor
                .save()
                .then((outputdata) => {
                  onSaveHandler(outputdata);
                })
                .catch((err) => {
                  console.log("ERROR");
                  console.log(err);
                });
            }}
          >
            Finalize the page
          </Button>
          <Button
            style={{ marginLeft: "10px" }}
            variant="contained"
            color="error"
            onClick={deleteHandler}
          >
            Delete the page
          </Button>
        </div>
        <div id="editorjs"></div>
      </div>
    </React.Fragment>
  );
}
