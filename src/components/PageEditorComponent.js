import React, { useState } from "react";
import EditorJS from "@editorjs/editorjs";
import { tools } from "../constants/toolsForEditor";
import { Button } from "@material-ui/core";
import AlertComponent from "./AlertComponent";

export default function PageEditorComponent(props) {
  const [pageJson] = useState({"blocks": props.pageDetails.blocks});
  const editor = new EditorJS({
    readOnly: false,
    holder: "editorjs",
    tools: tools,
    data: pageJson,
  });

  const { title, url, path } = props.pageDetails;

  const onSaveHandler = async (outputData) => {

		let method = "PUT";
		let api = "http:///insti-web-backend.herokuapp.com/api/page/update";
		let successMessage = "The page has been updated successfully.";
		if(props.newPage){
			method = "POST";
			api = "http:///insti-web-backend.herokuapp.com/api/page/add";
			successMessage = "New page has been added successfully";
		}

		const requestOptions = {
			method,
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${props.token}`,
			},
			body: JSON.stringify({...outputData, title, url, path}),
		};
		const response = await fetch(
			api,
			requestOptions
		);
		const data = await response.json();
		console.log(data);
		if(data.error){
			props.addAlert(
				<AlertComponent
					type="error"
					text="Sorry, there is no data."
				/>
			);
		} else {
			props.addAlert(
				<AlertComponent
					type="success"
					text={successMessage}
				/>
			);
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
        </div>
        <div id="editorjs"></div>
      </div>
    </React.Fragment>
  );
}
