import React, { useState } from "react";
import EditorJS from "@editorjs/editorjs";
import { tools } from "../constants/toolsForEditor";
import { Button } from "@material-ui/core";
import AlertComponent from "./AlertComponent";

export default function PageEditorComponent(props) {
  const [pageJson, setPageJson] = useState({"blocks": props.pageDetails.blocks});
  const editor = new EditorJS({
    readOnly: false,
    holder: "editorjs",
    tools: tools,
    data: pageJson,
  });

  const { title } = props.pageDetails;

  const onSaveHandler = async () => {
		const requestOptions = {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${props.token}`,
			},
			body: JSON.stringify({  }),
		};
		const response = await fetch(
			"http://localhost:8000/api/page/get",
			requestOptions
		);
		const data = await response.json();
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
					text="The page has been updated successfully."
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
            onClick={() => {
              editor
                .save()
                .then((outputdata) => {
                  setPageJson(outputdata);
                })
                .catch((err) => {
                  console.log("ERROR");
                  console.log(err);
                });
              onSaveHandler();
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
