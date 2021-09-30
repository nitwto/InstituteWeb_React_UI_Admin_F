import "../styles/App.css";
import React, { useState, useRef } from "react";

import {
  FormControl,
  Input,
  InputLabel,
  FormHelperText,
  FormControlLabel,
  Checkbox,
  TextField,
  Button,
  Select,
  MenuItem,
} from "@material-ui/core/";
import { pageschema } from "../constants/schemas";
import { getInitialState, isCorrect } from "../util/formHelpers";
import AlertComponent from "./AlertComponent";
import { API } from "../constants/extras";

export default function CreatePageWithJSON(props) {

	const [PageDetails, setPageDetails] = useState(
    getInitialState(pageschema)
  );
  const [zeroSubmission, setZeroSubmission] = useState(true);
  const [focus, setFocus] = useState(false);

  const titleRef = useRef(null);
  const pathRef = useRef(null);
  const urlRef = useRef(null);
  const jsonRef = useRef(null);


  const styles = {
    margin: "10px",
    width: "300px",
  };

  const resetAll = () => {
    setPageDetails(getInitialState(pageschema));
    setFocus(false);
    setZeroSubmission(true);
  };

  const focusElement = (formFields) => {
    for (const field in formFields) {
      if (formFields[field].error) {
        switch (field) {
          case "title":
            titleRef.current.focus();
            break;
          case "path":
            pathRef.current.focus();
            break;
          case "url":
            urlRef.current.focus();
            break;
          case "json":
            jsonRef.current.focus();
            break;
          default:
            break;
        }
        return;
      }
    }
  };

  const getFormFields = () => {
    let formFields = {};
    for (const field in pageschema) {
      const extendedField = {};
      extendedField.error = false;
      extendedField.formHelperText = "";
      formFields[field] = extendedField;

      if (!zeroSubmission) {
        if (
          pageschema[field].required &&
          PageDetails[field] === ""
        ) {
          formFields[field].error = true;
          formFields[field].formHelperText = "The given field is required.";
        } else if (pageschema[field].type === String) {
          if (
            pageschema[field].minlength >
            PageDetails[field].length
          ) {
            formFields[field].error = true;
            formFields[
              field
            ].formHelperText = `The ${field} should be of atleast ${pageschema[field].minlength} length`;
          }
          if (
            pageschema[field].maxlength <
            PageDetails[field].length
          ) {
            formFields[field].error = true;
            formFields[
              field
            ].formHelperText = `The ${field} should not exceed ${pageschema[field].maxlength} length`;
          }
        }
      }
    }

    if (focus) {
      focusElement(formFields);
      setFocus(false);
    }

    return formFields;
  };

  const setValue = (field, value) => {
    setPageDetails((prevState) => {
      let newState = { ...prevState };
      newState[field] = value;
      return newState;
    });
  };

  const onChangeHandler = (object, type, date = null) => {
    let value = object.target.value;
    let obj = object.target.id;
    if (!obj) obj = object.target.name;
    if (type === Boolean) value = object.target.checked;

    setValue(obj, value);

  };

  const submitHandler = async (e) => {
    e.preventDefault();
		
    if (isCorrect(pageschema, PageDetails)) {
			let {title, path, url, json} = PageDetails;
			let object = JSON.parse(json);
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.token}`,
        },
        body: JSON.stringify({...object, title, path, url}),
      };
      const response = await fetch(
        `${API}/page/add`,
        requestOptions
      );

      const data = await response.json();
      if(data.error){
        props.addAlert(
          <AlertComponent
            type="error"
            text={data.error}
          />
        );
        return;
      }
      // console.log("data -- ",data);
      props.addAlert(
        <AlertComponent
          type="success"
          text="New page has been added successfully"
        />
      );
      resetAll();
    } else {
      setZeroSubmission(false);
      setFocus(true);
    }
  };

  // useEffect(() => {
  //   titleRef.current.focus();
  // }, []);
  const errorFields = getFormFields();
  return (
    <React.Fragment>
      <div>
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
          <InputLabel htmlFor={"title"}>{"Title"}</InputLabel>
          <Input
            id={"title"}
            aria-describedby="my-helper-text"
            value={PageDetails["title"]}
            onChange={(obj) => onChangeHandler(obj, String)}
            error={errorFields["title"].error}
            inputRef={titleRef}
          />
          <FormHelperText id="my-helper-text">
            {errorFields["title"].formHelperText}
          </FormHelperText>
        </FormControl>
        <FormControl fullWidth={true} style={styles} required>
          <InputLabel htmlFor={"path"}>{"Path"}</InputLabel>
          <Input
            id={"path"}
            aria-describedby="my-helper-text"
            value={PageDetails["path"]}
            onChange={(obj) => onChangeHandler(obj, String)}
            error={errorFields["path"].error}
            inputRef={pathRef}
          />
          <FormHelperText id="my-helper-text">
            {errorFields["path"].formHelperText}
          </FormHelperText>
        </FormControl>
        <FormControl fullWidth={true} style={styles} required>
          <InputLabel htmlFor={"url"}>{"Url"}</InputLabel>
          <Input
            id={"url"}
            aria-describedby="my-helper-text"
            value={PageDetails["url"]}
            onChange={(obj) => onChangeHandler(obj, Number)}
            error={errorFields["url"].error}
            inputRef={urlRef}
          />
          <FormHelperText id="my-helper-text">
            {errorFields["url"].formHelperText}
          </FormHelperText>
        </FormControl>
        <FormControl fullWidth={true} style={styles} required>
          <InputLabel htmlFor={"json"}>{"JSON"}</InputLabel>
          <Input
            id={"json"}
            aria-describedby="my-helper-text"
            value={PageDetails["json"]}
            onChange={(obj) => onChangeHandler(obj, Number)}
            error={errorFields["json"].error}
            inputRef={jsonRef}
          />
          <FormHelperText id="my-helper-text">
            {errorFields["json"].formHelperText}
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
          Submit
        </Button>
        <Button
          style={{ marginLeft: "10px" }}
          variant="contained"
          color="secondary"
          onClick={resetAll}
        >
          Reset
        </Button>
      </div>
    </React.Fragment>
  );
		
}
