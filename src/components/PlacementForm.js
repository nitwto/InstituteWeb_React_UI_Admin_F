import "../styles/App.css";
import React, { useState, useRef } from "react";
import { placementschema } from "../constants/schemas";
import { getInitialState } from "../util/formHelpers";

import {
  FormControl,
  Input,
  InputLabel,
  FormHelperText,
  Button,
  Select,
  MenuItem,
} from "@material-ui/core/";

import { isCorrect } from "../util/formHelpers";
import { COURSES , API} from "../constants/extras";
import AlertComponent from "./AlertComponent";

function PlacementForm(props) {
  const [PlacementDetails, setPlacementDetails] = useState(
    getInitialState(placementschema)
  );
  const [zeroSubmission, setZeroSubmission] = useState(true);
  const [focus, setFocus] = useState(false);

  const academic_yearRef = useRef(null);
  const branchRef = useRef(null);
  const min_packageRef = useRef(null);
  const max_packageRef = useRef(null);
  const avg_packageRef = useRef(null);
  const total_placedRef = useRef(null);
  const total_studentsRef = useRef(null);


  const styles = {
    margin: "10px",
    width: "300px",
  };

  const resetAll = () => {
    setPlacementDetails(getInitialState(placementschema));
    setFocus(false);
    setZeroSubmission(true);
  };

  const focusElement = (formFields) => {
    for (const field in formFields) {
      if (formFields[field].error) {
        switch (field) {
          case "academic_year":
            academic_yearRef.current.focus();
            break;
          case "branch":
            branchRef.current.focus();
            break;
          case "min_package":
            min_packageRef.current.focus();
            break;
          case "max_package":
            max_packageRef.current.focus();
            break;
          case "avg_package":
            avg_packageRef.current.focus();
            break;
          case "total_placed":
            total_placedRef.current.focus();
            break;
          case "total_students":
            total_studentsRef.current.focus();
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
    for (const field in placementschema) {
      const extendedField = {};
      extendedField.error = false;
      extendedField.formHelperText = "";
      formFields[field] = extendedField;

      if (!zeroSubmission) {
        if (
          placementschema[field].required &&
          PlacementDetails[field] === ""
        ) {
          formFields[field].error = true;
          formFields[field].formHelperText = "The given field is required.";
        } else if (placementschema[field].type === String) {
          if (
            placementschema[field].minlength >
            PlacementDetails[field].length
          ) {
            formFields[field].error = true;
            formFields[
              field
            ].formHelperText = `The ${field} should be of atleast ${placementschema[field].minlength} length`;
          }
          if (
            placementschema[field].maxlength <
            PlacementDetails[field].length
          ) {
            formFields[field].error = true;
            formFields[
              field
            ].formHelperText = `The ${field} should not exceed ${placementschema[field].maxlength} length`;
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
    setPlacementDetails((prevState) => {
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
    if (isCorrect(placementschema, PlacementDetails)) {
      // console.log(`Bearer ${props.token}`);
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.token}`,
        },
        body: JSON.stringify(PlacementDetails),
      };
      const response = await fetch(
        `${API}/placements/add`,
        requestOptions
      );
      if (!response) {
        props.addAlert(
          <AlertComponent
            type="error"
            text="The placement data wasn't added. Please try later."
          />
        );
        return;
      }
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
          text="The placement data has been added to the website."
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
        <h2>Placement Form</h2>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "column",
          alignContent: "center",
        }}
      >
        
        <FormControl variant="filled" fullWidth={true} style={styles} required>
          <InputLabel id="demo-simple-select-label">Course</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="course"
            name="course"
            value={PlacementDetails["course"]}
            onChange={(obj) => onChangeHandler(obj, String)}
            error={errorFields["course"].error}
          >
            {COURSES.map((course) => {
              return <MenuItem value={course}>{course}</MenuItem>;
            })}
          </Select>
          <FormHelperText id="my-helper-text">
            {errorFields["course"].formHelperText}
          </FormHelperText>
        </FormControl>

        <FormControl fullWidth={true} style={styles} required>
          <InputLabel htmlFor={"academic_year"}>{"Academic year. ex(2021-22)"}</InputLabel>
          <Input
            id={"academic_year"}
            aria-describedby="my-helper-text"
            value={PlacementDetails["academic_year"]}
            onChange={(obj) => onChangeHandler(obj, String)}
            error={errorFields["academic_year"].error}
            inputRef={academic_yearRef}
          />
          <FormHelperText id="my-helper-text">
            {errorFields["academic_year"].formHelperText}
          </FormHelperText>
        </FormControl>
        <FormControl fullWidth={true} style={styles} required>
          <InputLabel htmlFor={"branch"}>{"Branch"}</InputLabel>
          <Input
            id={"branch"}
            aria-describedby="my-helper-text"
            value={PlacementDetails["branch"]}
            onChange={(obj) => onChangeHandler(obj, String)}
            error={errorFields["branch"].error}
            inputRef={branchRef}
          />
          <FormHelperText id="my-helper-text">
            {errorFields["branch"].formHelperText}
          </FormHelperText>
        </FormControl>
        <FormControl fullWidth={true} style={styles} required>
          <InputLabel htmlFor={"min_package"}>{"Min Package"}</InputLabel>
          <Input
            id={"min_package"}
            aria-describedby="my-helper-text"
            value={PlacementDetails["min_package"]}
            onChange={(obj) => onChangeHandler(obj, Number)}
            error={errorFields["min_package"].error}
            inputRef={min_packageRef}
          />
          <FormHelperText id="my-helper-text">
            {errorFields["min_package"].formHelperText}
          </FormHelperText>
        </FormControl>
        <FormControl fullWidth={true} style={styles} required>
          <InputLabel htmlFor={"max_package"}>{"Max Package"}</InputLabel>
          <Input
            id={"max_package"}
            aria-describedby="my-helper-text"
            value={PlacementDetails["max_package"]}
            onChange={(obj) => onChangeHandler(obj, Number)}
            error={errorFields["max_package"].error}
            inputRef={max_packageRef}
          />
          <FormHelperText id="my-helper-text">
            {errorFields["max_package"].formHelperText}
          </FormHelperText>
        </FormControl>
        <FormControl fullWidth={true} style={styles} required>
          <InputLabel htmlFor={"avg_package"}>{"Avg Package"}</InputLabel>
          <Input
            id={"avg_package"}
            aria-describedby="my-helper-text"
            value={PlacementDetails["avg_package"]}
            onChange={(obj) => onChangeHandler(obj, Number)}
            error={errorFields["avg_package"].error}
            inputRef={avg_packageRef}
          />
          <FormHelperText id="my-helper-text">
            {errorFields["avg_package"].formHelperText}
          </FormHelperText>
        </FormControl>
        <FormControl fullWidth={true} style={styles} required>
          <InputLabel htmlFor={"total_placed"}>{"Total Placed"}</InputLabel>
          <Input
            id={"total_placed"}
            aria-describedby="my-helper-text"
            value={PlacementDetails["total_placed"]}
            onChange={(obj) => onChangeHandler(obj, Number)}
            error={errorFields["total_placed"].error}
            inputRef={total_placedRef}
          />
          <FormHelperText id="my-helper-text">
            {errorFields["total_placed"].formHelperText}
          </FormHelperText>
        </FormControl>
        <FormControl fullWidth={true} style={styles} required>
          <InputLabel htmlFor={"total_students"}>{"Total Students"}</InputLabel>
          <Input
            id={"total_students"}
            aria-describedby="my-helper-text"
            value={PlacementDetails["total_students"]}
            onChange={(obj) => onChangeHandler(obj, Number)}
            error={errorFields["total_students"].error}
            inputRef={total_studentsRef}
          />
          <FormHelperText id="my-helper-text">
            {errorFields["total_students"].formHelperText}
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

export default PlacementForm;
