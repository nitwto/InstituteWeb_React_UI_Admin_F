import "../styles/App.css";
import React, { useState, useRef, useEffect } from "react";
import FormComponent from "../components/FormComponent";
import { useSelector, useDispatch } from "react-redux";
import { notificationActions } from "../store/notificationslice";
import { notificationSchema } from "../constants/schemas";
import { getInitialState } from "../util/sliceHelpers";

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
  const dispatch = useDispatch();
  const [notificationDetails, setNotificaitonDetails] = useState(
    getInitialState(notificationSchema)
  );
  const [zeroSubmission, setZeroSubmission] = useState(true);

  const titleRef = useRef(null);
  const summaryRef = useRef(null);
  const descriptionRef = useRef(null);
  const contentTypeRef = useRef(null);
  const urlRef = useRef(null);

  const styles = {
    margin: "10px",
    width: "300px",
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
      console.log()
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
      setZeroSubmission(true);
    } else {
      setZeroSubmission(false);
    }
  };

    // useEffect(() => {
    //   titleRef.current.focus();
    // }, []);

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
            inputRef={titleRef}
          />
          <FormHelperText id="my-helper-text">Hi</FormHelperText>
        </FormControl>
        <FormControl fullWidth={true} style={styles} required>
          <InputLabel htmlFor={"summary"}>{"summary"}</InputLabel>
          <Input
            id={"summary"}
            aria-describedby="my-helper-text"
            value={notificationDetails["summary"]}
            onChange={(obj) => onChangeHandler(obj, String)}
            inputRef={summaryRef}
          />
          <FormHelperText id="my-helper-text">Hi</FormHelperText>
        </FormControl>
        <FormControl fullWidth={true} style={styles} required>
          <InputLabel htmlFor={"contentType"}>{"contentType"}</InputLabel>
          <Input
            id={"contentType"}
            aria-describedby="my-helper-text"
            value={notificationDetails["contentType"]}
            onChange={(obj) => onChangeHandler(obj, String)}
            inputRef={contentTypeRef}
          />
          <FormHelperText id="my-helper-text">Hi</FormHelperText>
        </FormControl>
        <FormControl fullWidth={true} style={styles} required>
          <InputLabel htmlFor={"description"}>{"description"}</InputLabel>
          <Input
            id={"description"}
            aria-describedby="my-helper-text"
            value={notificationDetails["description"]}
            onChange={(obj) => onChangeHandler(obj, String)}
            inputRef={descriptionRef}
          />
          <FormHelperText id="my-helper-text">Hi</FormHelperText>
        </FormControl>
        <FormControl fullWidth={true} style={styles}>
          <FormControlLabel
            control={
              <Checkbox
                checked={notificationDetails["is_published"]}
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
                checked={notificationDetails["is_breaking_news"]}
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
            inputRef={urlRef}
          />
          <FormHelperText id="my-helper-text">Hi</FormHelperText>
        </FormControl>
        <LocalizationProvider dateAdapter={DateFnsUtils}>
          <DatePicker
            label={"Start Date"}
            value={notificationDetails["start_date"]}
            onChange={(date) =>
              setValue(
                "start_date",
                date
              )
            }
            renderInput={(params) => <TextField {...params} style={styles}/>}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={DateFnsUtils}  >
          <DatePicker
            label={"End Date"}
            value={notificationDetails["end_date"]}
            onChange={(date) =>
              setValue(
                "end_date",
                date
              )
            }
            renderInput={(params) => <TextField {...params} style={styles}/>}
          />
        </LocalizationProvider>
      </div>
      <div>
        <Button style={{marginLeft: "10px"}} variant="contained" color="primary" onClick={submitHandler}>
          Submit
        </Button>
      </div>
    </React.Fragment>
  );
}

export default NotificationForm;
