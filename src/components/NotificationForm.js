import "../styles/App.css";
import React, { useState, useRef, useEffect } from "react";
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
} from "@material-ui/core/";
import { DatePicker,DateTimePicker, LocalizationProvider } from "@material-ui/lab";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";

import { isCorrect } from "../util/formHelpers";
import { API, DEPARTMENTS } from "../constants/extras";
import AlertComponent from "./AlertComponent";
import AlertDialogComponent from "./AlertDialogComponent";

function NotificationForm(props) {
  const [newNotification, setNewNotification] = useState(true);
  const [notificationDetails, setNotificaitonDetails] = useState(
    getInitialState(notificationSchema)
  );
  const [updateDepartment, setUpdateDepartment] = useState(null);
  const [updateTitle, setUpdateTitle] = useState(null);
  const [allNotifications, setAllNotifications] = useState([]);
  const [zeroSubmission, setZeroSubmission] = useState(true);
  const [focus, setFocus] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const titleRef = useRef(null);
  const summaryRef = useRef(null);
  const descriptionRef = useRef(null);
  const contentTypeRef = useRef(null);
  const urlRef = useRef(null);

  const { token, addAlert } = props;

  const styles = {
    margin: "10px",
    width: "300px",
  };

  useEffect(() => {
    async function fetchAllNotifApi() {
      const requestOptions = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await fetch(
        `${API}/notification/getall`,
        requestOptions
      );
      if (!response) {
        addAlert(
          <AlertComponent
            type="error"
            text="There are some issues to be encountered. Please try again later."
          />
        );
        return;
      }
      const data = await response.json();
      setAllNotifications(data);
    }

    async function fetchDeptNotifApi() {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ department: updateDepartment }),
      };
      const response = await fetch(`${API}/notification/dept`, requestOptions);
      if (!response) {
        addAlert(
          <AlertComponent
            type="error"
            text="There are some issues to be encountered. Please try again later."
          />
        );
        return;
      }
      const data = await response.json();
      setAllNotifications(data);
    }

    if (updateDepartment !== null) {
      if (updateDepartment === "All") {
        fetchAllNotifApi();
      } else {
        fetchDeptNotifApi();
      }
    }
  }, [updateDepartment, token, addAlert]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const resetAll = () => {
    setNotificaitonDetails(getInitialState(notificationSchema));
    setFocus(false);
    setZeroSubmission(true);
    setUpdateDepartment(null);
    setUpdateTitle(null);
    setAllNotifications([]);
  };

  const toggleNewNotification = (event) => {
    setNewNotification((prevState) => {
      return !prevState;
    });
    resetAll();
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
    if (field === "updateDepartment") {
      resetAll();
      setUpdateDepartment(value);
      return;
    }
    if (field === "updateTitle") {
      setUpdateTitle(value);
      setNotificaitonDetails(value);
      return;
    }
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

  const deleteNotification = async () => {
    if (notificationDetails) {
      const requestOptions = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.token}`,
        },
        body: JSON.stringify(notificationDetails),
      };
      const response = await fetch(
        `https://insti-web-backend.herokuapp.com/api/notification/delete/${notificationDetails._id}`,
        requestOptions
      );
      const data = await response.json();
      if (data.err) {
        props.addAlert(<AlertComponent type="error" text={data.err} />);
      } else {
        props.addAlert(
          <AlertComponent
            type="success"
            text={"The notification has been deleted successfully."}
          />
        );
      }
      resetAll();
    } else {
      setZeroSubmission(false);
      setFocus(true);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (isCorrect(notificationSchema, notificationDetails)) {
      var requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.token}`,
        },
        body: JSON.stringify(notificationDetails),
      };
      var data;
      if (newNotification) {
        const response = await fetch(`${API}/notification/add`, requestOptions);
        if (!response) {
          props.addAlert(
            <AlertComponent
              type="error"
              text="The notification wasn't added. Please try later."
            />
          );
          return;
        }
        data = await response.json();
      } else {
        requestOptions.method = "PUT";
        const response = await fetch(
          `https://insti-web-backend.herokuapp.com/api/notification/update/${notificationDetails._id}`,
          requestOptions
        );
        if (!response) {
          props.addAlert(
            <AlertComponent
              type="error"
              text="The notification wasn't updated. Please try later."
            />
          );
          return;
        }
        data = await response.json();
      }

      if (data.err) {
        props.addAlert(<AlertComponent type="error" text={data.err} />);
      } else {
        props.addAlert(
          <AlertComponent
            type="success"
            text={
              newNotification
                ? "The notification has been added to the website."
                : "The notification has beed updated."
            }
          />
        );
        resetAll();
      }
    } else {
      setZeroSubmission(false);
      setFocus(true);
    }
  };

  const getInitialUpdateForm = () => {
    if (!newNotification)
      return (
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <FormControl
            variant="filled"
            fullWidth={true}
            style={styles}
            required
          >
            <InputLabel id="dept-select-label">Department</InputLabel>
            <Select
              labelId="dept-select-label"
              id="updateDepartment"
              name="updateDepartment"
              value={updateDepartment}
              onChange={(obj) => onChangeHandler(obj, String)}
            >
              {DEPARTMENTS.map((department) => {
                return (
                  <MenuItem value={department.value}>
                    {department.title}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl
            variant="filled"
            fullWidth={true}
            style={styles}
            required
          >
            <InputLabel id="title-select-label">Title</InputLabel>
            <Select
              labelId="title-select-label"
              id="updateTitle"
              name="updateTitle"
              value={updateTitle}
              onChange={(obj) => onChangeHandler(obj, String)}
            >
              {allNotifications.map((notification) => {
                return (
                  <MenuItem value={notification}>{notification.title}</MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
      );
  };

  const getTheForm = () => {
    if (newNotification || updateTitle !== null)
      return (
        <div>
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
            <FormControl
              variant="filled"
              fullWidth={true}
              style={styles}
              required
            >
              <InputLabel id={"contentTypeLabel"}>{"Content Type"}</InputLabel>
              <Select
                labelId="contentTypeLabel"
                id="contentType"
                name="contentType"
                value={notificationDetails["contentType"]}
                onChange={(obj) => onChangeHandler(obj, String)}
                error={errorFields["contentType"].error}
              >
                <MenuItem value={"announcements_news_notices"}>
                  {"announcements_news_notices"}
                </MenuItem>
                <MenuItem value={"jobs_tenders"}>{"jobs_tenders"}</MenuItem>
                <MenuItem value={"workshops_conferences"}>
                  {"workshops_conferences"}
                </MenuItem>
              </Select>
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
            <FormControl
              variant="filled"
              fullWidth={true}
              style={styles}
              required
            >
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
                  return (
                    <MenuItem value={department.value}>
                      {department.title}
                    </MenuItem>
                  );
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
              <DateTimePicker
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
              <DateTimePicker
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
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "10px",
            }}
          >
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
            {!newNotification && (
              <Button
                style={{ marginLeft: "10px" }}
                variant="contained"
                color="error"
                onClick={handleOpenDialog}
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      );
    else {
      return <div></div>;
    }
  };

  const errorFields = getFormFields();
  return (
    <React.Fragment>
      <div>
        <h2>Notification Form</h2>
      </div>
      <div style={{ margin: "10px" }}>
        <Button onClick={toggleNewNotification}>
          {newNotification
            ? "Update or Delete an existing notification"
            : "Create a new Notification"}
        </Button>
        {getInitialUpdateForm()}
        {getTheForm()}
      </div>
      <AlertDialogComponent
        title="Are you sure you want to delete the following page?"
        openDialog={openDialog}
        onDisagree={handleCloseDialog}
        onAgree={() => {
          deleteNotification();
          handleCloseDialog();
        }}
      />
    </React.Fragment>
  );
}

export default NotificationForm;
