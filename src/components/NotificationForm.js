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
  Select,
  MenuItem,
  Alert,
  Collapse,
  IconButton, 
} from "@material-ui/core/";
import { DatePicker, LocalizationProvider } from "@material-ui/lab";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import CloseIcon from '@material-ui/icons/Close';

import { isCorrect } from "../util/formHelpers";
import { DEPARTMENTS } from "../constants/extras";

function NotificationForm() {
  const [notificationDetails, setNotificaitonDetails] = useState(
    getInitialState(notificationSchema)
  );
  const [zeroSubmission, setZeroSubmission] = useState(true);
  const [focus, setFocus] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [failureAlert, setFailureAlert] = useState(false); 

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
  };

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
    if (!zeroSubmission) {
      if (
        Date.parse(notificationDetails["start_date"]) / (3600 * 24) >
        Date.parse(notificationDetails["end_date"]) / (3600 * 24)
      ) {
        formFields["start_date"].error = true;
        formFields["end_date"].error = true;
      }
      if (
        Date.parse(notificationDetails["start_date"]) / (3600 * 24) <
        Date.now() / (3600 * 24)
      ) {
        formFields["start_date"].error = true;
      }
    }

    if (focus) {
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
    let obj = object.target.id;
    if (!obj) obj = object.target.name;
    if (type === Boolean) value = object.target.checked;

    setValue(obj, value);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (isCorrect(notificationSchema, notificationDetails)) {
      console.log(notificationDetails);
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notificationDetails),
      };
      const response = await fetch(
        "http://localhost:8000/api/notification/add",
        requestOptions
      );
      if(!response){
        setFailureAlert(true);
        return;
      }
      const data = await response.json();
      console.log(data);
      setSuccessAlert(true);
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
      <Collapse in={successAlert}>
        <Alert
          severity="success"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setSuccessAlert(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          The notification has been accepted succesfully.
        </Alert>
      </Collapse>
      <Collapse in={failureAlert}>
        <Alert
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setFailureAlert(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          The notification has been accepted succesfully.
        </Alert>
      </Collapse>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "column",
          alignContent: "center",
        }}
      >
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
        <FormControl variant="filled" fullWidth={true} style={styles} required>
          <InputLabel id="demo-simple-select-label">Department</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="department"
            name="department"
            value={notificationDetails["department"]}
            onChange={(obj) => onChangeHandler(obj, String)}
            error={errorFields["department"].error}
          >
            {DEPARTMENTS.map((department) => {
              return <MenuItem value={department}>{department}</MenuItem>;
            })}
          </Select>
          <FormHelperText id="my-helper-text">
            {errorFields["department"].formHelperText}
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
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label={"Start Date"}
            value={notificationDetails["start_date"]}
            onChange={(date) => setValue("start_date", date)}
            renderInput={(params) => (
              <TextField
                {...params}
                style={styles}
                error={errorFields["start_date"].error}
              />
            )}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label={"End Date"}
            value={notificationDetails["end_date"]}
            onChange={(date) => setValue("end_date", date)}
            renderInput={(params) => (
              <TextField
                {...params}
                style={styles}
                error={errorFields["end_date"].error}
              />
            )}
          />
        </LocalizationProvider>
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

export default NotificationForm;
