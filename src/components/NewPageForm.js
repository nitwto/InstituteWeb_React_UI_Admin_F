import React, { useRef, useState } from "react";
import { defaultData } from "../constants/dataForEditor"
import {
  FormControl,
  Input,
  InputLabel,
  FormHelperText,
  Button,
} from "@material-ui/core/";
import PageEditorComponent from "./PageEditorComponent";

export default function NewPageForm(props) {
  const [pageCreationArea, setPageCreationArea] = useState(false);
  const [title, settitle] = useState("");
  const [path, setpath] = useState("");
  const [url, seturl] = useState("");
  const [zeroSubmission, setZeroSubmission] = useState(true);
  const [focus, setFocus] = useState(false);
  const titleRef = useRef(null);
  const pathRef = useRef(null);
  const urlRef = useRef(null);

  let titleError = false;
  let pathError = false;
  let urlError = false;
  let titleErrorText = "";
  let pathErrorText = "";
  let urlErrorText = "";

  const styles = {
    margin: "10px",
    width: "300px",
  };

  const resetAll = () => {
    settitle("");
    setpath("");
    seturl("");
    setFocus(false);
    setZeroSubmission(true);
  };

  const onChangeHandler = (object) => {
    const value = object.target.value;
    const obj = object.target.id;

    if (obj === "title") {
      settitle(value);
    } else if (obj === "path") {
      setpath(value);
    } else {
      seturl(value);
    }
  };

  const isCorrect = () => {
    if (
      (url === "") | (title === "") ||
      title.length < 3 ||
      path === "" ||
      path.length < 3
    )
      return false;

    return true;
  };

  const getError = () => {
    if (url === "") {
      urlError = true;
      urlErrorText = "url is required.";
    }
    if (path === "" || path.length < 3) {
      pathError = true;
      if (path === "") {
        pathErrorText = "path is required.";
      } else {
        pathErrorText = "path needs to be of greater than 3 chars.";
      }

      if (title === "" || title.length < 3) {
        titleError = true;
        if (title === "") {
          titleErrorText = "title is required.";
        } else {
          titleErrorText = "title needs to be of greater than 3 chars.";
        }
      }
    }

    if (focus) {
      if (urlError) {
        urlRef.current.focus();
      } else if (titleError) {
        titleRef.current.focus();
      } else {
        pathRef.current.focus();
      }
      setFocus(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (isCorrect()) {
      setPageCreationArea(true);
    } else {
      setZeroSubmission(false);
      setFocus(true);
    }
  };

  if (!zeroSubmission) getError();
  return (
    <React.Fragment>
      {pageCreationArea ? (
        <PageEditorComponent 
					pageDetails={{...defaultData, title, url, path}}
					handleTab={props.handleTab}
					addAlert={props.addAlert}
					token={props.token}
					newPage={true}
				/>
      ) : (
        <React.Fragment>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              flexDirection: "column",
              alignContent: "center",
            }}
          >
            <h2>New Page Form</h2>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              flexDirection: "column",
              alignContent: "center",
            }}
          >
            <FormControl fullWidth={true} style={styles} required>
              <InputLabel htmlFor={"url"}>{"Url"}</InputLabel>
              <Input
                id={"url"}
                aria-describedby="my-helper-text"
                value={url}
                onChange={(obj) => onChangeHandler(obj)}
                error={urlError}
                inputRef={urlRef}
              />
              <FormHelperText id="my-helper-text">
                {urlErrorText}
              </FormHelperText>
            </FormControl>
            <FormControl fullWidth={true} style={styles} required>
              <InputLabel htmlFor={"title"}>{"Title For Page"}</InputLabel>
              <Input
                id={"title"}
                aria-describedby="my-helper-text"
                value={title}
                onChange={(obj) => onChangeHandler(obj)}
                error={titleError}
                inputRef={titleRef}
              />
              <FormHelperText id="my-helper-text">
                {titleErrorText}
              </FormHelperText>
            </FormControl>

            <FormControl fullWidth={true} style={styles} required>
              <InputLabel htmlFor={"path"}>{"Path"}</InputLabel>
              <Input
                id={"path"}
                aria-describedby="my-helper-text"
                value={path}
                onChange={(obj) => onChangeHandler(obj)}
                error={pathError}
                inputRef={pathRef}
              />
              <FormHelperText id="my-helper-text">
                {pathErrorText}
              </FormHelperText>
            </FormControl>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              style={{ marginLeft: "10px" }}
              variant="contained"
              color="primary"
              onClick={submitHandler}
            >
              Move Forward To Page Creation Area
            </Button>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}
