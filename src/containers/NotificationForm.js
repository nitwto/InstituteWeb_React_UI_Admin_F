import "../styles/App.css";
import React, { useState, useRef } from "react";
import { notificationSchema } from "../constants/schemas";
import { getInitialState } from "../util/formHelpers";

import {
  FormControl,
  Input,
  InputLabel,
  FormHelperText,
  FormControlLabel,
  Checkbox,
  TextField,
  Button,
} from "@material-ui/core/";
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, LocalizationProvider } from "@material-ui/lab";

import { isCorrect } from "../util/formHelpers";

function NotificationForm() {
  const [notificationDetails, setNotificaitonDetails] = useState(
    getInitialState(notificationSchema)
  );
  const [zeroSubmission, setZeroSubmission] = useState(true);
  const [focus, setFocus] = useState(false);

  const titleRef = useRef(null);
  const summaryRef = useRef(null);
  const descriptionRef = useRef(null);
  const contentTypeRef = useRef(null);
  const urlRef = useRef(null);

  const styles = {
    margin: "10px",
    width: "300px",
  };

  const resetAll = () => {
    setNotificaitonDetails(getInitialState(notificationSchema));
    setFocus(false);
    setZeroSubmission(true);
  }

  const focusElement = (formFields) => {
    for (const field in formFields) {
      if (formFields[field].error) {
        switch (field) {
          case "title":
            titleRef.current.focus();
            break;
          case "summary":
            summaryRef.current.focus();
            break;
          case "description":
            descriptionRef.current.focus();
            break;
          case "contentType":
            contentTypeRef.current.focus();
            break;
          case "url":
            urlRef.current.focus();
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
    for (const field in notificationSchema) {
      const extendedField = {};
      extendedField.error = false;
      extendedField.formHelperText = "";
      formFields[field] = extendedField;

      if (!zeroSubmission) {
        if (
          notificationSchema[field].required &&
          notificationDetails[field] === ""
        ) {
          formFields[field].error = true;
          formFields[field].formHelperText = "The given field is required.";
        } else if (notificationSchema[field].type === String) {
          if (
            notificationSchema[field].minlength >
            notificationDetails[field].length
          ) {
            formFields[field].error = true;
            formFields[
              field
            ].formHelperText = `The ${field} should be of atleast ${notificationSchema[field].minlength} length`;
          }
          if (
            notificationSchema[field].maxlength <
            notificationDetails[field].length
          ) {
            formFields[field].error = true;
            formFields[
              field
            ].formHelperText = `The ${field} should not exceed ${notificationSchema[field].maxlength} length`;
          }
        }
      }
    }

    if(focus){
      focusElement(formFields);
      setFocus(false);
    }

    return formFields;
  };

  const setValue = (field, value) => {
    setNotificaitonDetails((prevState) => {
      let newState = { ...prevState };
      newState[field] = value;
      return newState;
    });
  };

  const onChangeHandler = (object, type, date = null) => {
    let value = object.target.value;
    if (type === Boolean) value = object.target.checked;

    setValue(object.target.id, value);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (isCorrect(notificationSchema, notificationDetails)) {
      console.log();
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notificationDetails),
      };
      const response = await fetch(
        "http://localhost:8000/api/notification/add",
        requestOptions
      );
      const data = await response.json();
      console.log(data);
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
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <FormControl fullWidth={true} style={styles} required>
          <InputLabel htmlFor={"title"}>{"title"}</InputLabel>
          <Input
            id={"title"}
            aria-describedby="my-helper-text"
            value={notificationDetails["title"]}
            onChange={(obj) => onChangeHandler(obj, String)}
            error={errorFields["title"].error}
            inputRef={titleRef}
          />
          <FormHelperText id="my-helper-text">
            {errorFields["title"].formHelperText}
          </FormHelperText>
        </FormControl>
        <FormControl fullWidth={true} style={styles} required>
          <InputLabel htmlFor={"summary"}>{"summary"}</InputLabel>
          <Input
            id={"summary"}
            aria-describedby="my-helper-text"
            value={notificationDetails["summary"]}
            onChange={(obj) => onChangeHandler(obj, String)}
            error={errorFields["summary"].error}
            inputRef={summaryRef}
          />
          <FormHelperText id="my-helper-text">
            {errorFields["summary"].formHelperText}
          </FormHelperText>
        </FormControl>
        <FormControl fullWidth={true} style={styles} required>
          <InputLabel htmlFor={"contentType"}>{"contentType"}</InputLabel>
          <Input
            id={"contentType"}
            aria-describedby="my-helper-text"
            value={notificationDetails["contentType"]}
            onChange={(obj) => onChangeHandler(obj, String)}
            error={errorFields["contentType"].error}
            inputRef={contentTypeRef}
          />
          <FormHelperText id="my-helper-text">
            {errorFields["contentType"].formHelperText}
          </FormHelperText>
        </FormControl>
        <FormControl fullWidth={true} style={styles} required>
          <InputLabel htmlFor={"description"}>{"description"}</InputLabel>
          <Input
            id={"description"}
            aria-describedby="my-helper-text"
            value={notificationDetails["description"]}
            onChange={(obj) => onChangeHandler(obj, String)}
            error={errorFields["description"].error}
            inputRef={descriptionRef}
          />
          <FormHelperText id="my-helper-text">
            {errorFields["description"].formHelperText}
          </FormHelperText>
        </FormControl>
        <FormControl fullWidth={true} style={styles}>
          <FormControlLabel
            control={
              <Checkbox
                value={notificationDetails["is_published"]}
                onChange={(obj) => onChangeHandler(obj, Boolean)}
                id={"is_published"}
              />
            }
            label={"is_published"}
          />
        </FormControl>
        <FormControl fullWidth={true} style={styles}>
          <FormControlLabel
            control={
              <Checkbox
                value={notificationDetails["is_breaking_news"]}
                onChange={(obj) => onChangeHandler(obj, Boolean)}
                id={"is_breaking_news"}
              />
            }
            label={"is_breaking_news"}
          />
        </FormControl>
        <FormControl fullWidth={true} style={styles} required>
          <InputLabel htmlFor={"url"}>{"url"}</InputLabel>
          <Input
            id={"url"}
            aria-describedby="my-helper-text"
            value={notificationDetails["url"]}
            onChange={(obj) => onChangeHandler(obj, String)}
            error={errorFields["url"].error}
            inputRef={urlRef}
          />
          <FormHelperText id="my-helper-text">
            {errorFields["url"].formHelperText}
          </FormHelperText>
        </FormControl>
        <LocalizationProvider dateAdapter={DateFnsUtils}>
          <DatePicker
            label={"Start Date"}
            value={notificationDetails["start_date"]}
            onChange={(date) => setValue("start_date", date)}
            renderInput={(params) => <TextField {...params} style={styles} />}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={DateFnsUtils}>
          <DatePicker
            label={"End Date"}
            value={notificationDetails["end_date"]}
            onChange={(date) => setValue("end_date", date)}
            renderInput={(params) => <TextField {...params} style={styles} />}
          />
        </LocalizationProvider>
      </div>
      <div>
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

export default NotificationForm;
