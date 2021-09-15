import React, { useRef, useState } from "react";

import {
  FormControl,
  Input,
  InputLabel,
  FormHelperText,
  FormControlLabel,
  Checkbox,
  Button,
  Select,
  MenuItem,
} from "@material-ui/core";
import { differenceOfArray } from "../util/common";
import { RightComponent } from "./RightComponent";

const completeRights = [];

export default function RightsForm(props) {
  const [userEmail, setuserEmail] = useState("");
  const [currentRights, setCurrentRights] = useState([]);
  const [notifRight, setNotifRight] = useState(currentRights.find((item) => item.url==="/notifyForm"));
  const [navBarRight, setNavBarRight] = useState(currentRights.find((item) => item.url==="/navigationForm"));
  const userEmailRef = useRef(null);

  const unAssignedRights = differenceOfArray(completeRights, currentRights);

  const styles = {
    margin: "10px",
    width: "300px",
  };

  let userEmailError = false;
  let userEmailErrorText = "User whose rights needed to be changed";

  const setValue = (obj, value) => {
    if (obj === "userEmail") {
      setuserEmail(value);
    } else if (obj === "notifRight") {
      setNotifRight(value);
    } else if (obj === "navBarRight") {
      setNavBarRight(value);
    } else if (obj === "addUserRight") {
      setCurrentRights((prevRights) => [...prevRights, value]);
    }
  };

  const onChangeHandler = (object, type, date = null) => {
    let value = object.target.value;
    let obj = object.target.id;
    if (!obj) obj = object.target.name;
    if (type === Boolean) value = object.target.checked;

    setValue(obj, value);
  };

  const removeRightHandler = (right) => {
    setCurrentRights((prevRights) => {
      return prevRights.filter((item) => {
        return item.url !== right;
      });
    });
  };

  return (
    <React.Fragment>
      <div>
        <h2>Rights Form</h2>
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
          <InputLabel htmlFor={"userEmail"}>{"User Email"}</InputLabel>
          <Input
            id={"userEmail"}
            aria-describedby="my-helper-text"
            value={userEmail}
            onChange={(obj) => onChangeHandler(obj, String)}
            error={userEmailError}
            inputRef={userEmailRef}
          />
          <FormHelperText id="my-helper-text">
            {userEmailErrorText}
          </FormHelperText>
        </FormControl>
        <FormControl fullWidth={true} style={styles}>
          <FormControlLabel
            control={
              <Checkbox
                value={notifRight}
                onChange={(obj) => onChangeHandler(obj, Boolean)}
                id={"notifRight"}
              />
            }
            label={"Allow to create Notifications"}
          />
        </FormControl>
        <FormControl fullWidth={true} style={styles}>
          <FormControlLabel
            control={
              <Checkbox
                value={navBarRight}
                onChange={(obj) => onChangeHandler(obj, Boolean)}
                id={"navBarRight"}
              />
            }
            label={"Allow to update Navigation Bar"}
          />
        </FormControl>
        <FormControl variant="filled" fullWidth={true} style={styles}>
          <InputLabel id="rightSelect">Add User Rights</InputLabel>
          <Select
            labelId="rightSelect"
            id="addUserRight"
            name="department"
            onChange={(obj) => onChangeHandler(obj, String)}
          >
            <MenuItem disabled>{"Select the Right"}</MenuItem>
            {unAssignedRights.map((right) => {
              return <MenuItem value={right}>{right.url}</MenuItem>;
            })}
          </Select>
        </FormControl>
        <div>
          {currentRights.map((right) => {
            return (
              <RightComponent
                key={right.url}
                url={right.url}
                name={right.right_name}
                removeRight={removeRightHandler}
              />
            );
          })}
        </div>
        <Button
          style={{ marginLeft: "10px" }}
          variant="contained"
          color="primary"
        >
          Submit
        </Button>
      </div>
    </React.Fragment>
  );
}
