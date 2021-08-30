import "../styles/App.css";
import { Button } from "@material-ui/core/";
import React, { useState } from "react";
import { InputComponent } from "./InputComponent";
import {isCorrect} from "../util/formHelpers"

function FormComponent(props) {
  const [focus, setFocus] = useState("");
  const [zeroSubmission, setZeroSubmission] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const verify = (formFields) => {
    let f = true;
    for (let i = 0; i < formFields.length; i++) {
      if (
        formFields[i].required &&
        props.fieldDetails[formFields[i].name] === ""
      ) {
        formFields[i].error = true;
        formFields[i].formHelperText = "The given field is required.";
      } else if (formFields[i].type === String) {
        if (
          formFields[i].minlength >
          props.fieldDetails[formFields[i].name].length
        ) {
          formFields[i].error = true;
          formFields[
            i
          ].formHelperText = `The ${formFields[i].name} should be of atleast ${formFields[i].minlength} length`;
        }
        if (
          formFields[i].maxlength <
          props.fieldDetails[formFields[i].name].length
        ) {
          formFields[i].error = true;
          formFields[
            i
          ].formHelperText = `The ${formFields[i].name} should not exceed length of ${formFields[i].minlength}`;
        }
      }

      if (formFields[i].error) {
        if (f) {
          if (submitted) {
            setFocus(formFields[i].name);
            setSubmitted(false);
          }
          f = false;
        }
      }
    }
    if (f) return true;
  };

  const getFormFields = () => {
    let formFields = [];
    for (const field in props.schema) {
      const extendedField = { ...props.schema[field] };
      extendedField.error = false;
      extendedField.formHelperText = "";
      extendedField.name = field;
      extendedField.autoFocus = false;
      if (focus === field) {
        extendedField.autoFocus = true;
      }
      formFields.push(extendedField);
    }
    if (!zeroSubmission) verify(formFields);
    return formFields;
  };

  const styles = {
    margin: "10px",
    width: "500px",
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (isCorrect(props.schema, props.fieldDetails)) {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(props.fieldDetails),
      };
      const response = await fetch(
        props.api,
        requestOptions
      );
      const data = await response.json();
      console.log(data);
      setZeroSubmission(true);
    } else {
      setZeroSubmission(false);
      setSubmitted(true);
    }
  };

  const onChangeHandler = (object, type, date = null) => {
    if(type === Date){
      props.setValue(object, date);
      setFocus(object);
      return;
    }

    let value = object.target.value;
    if (type === Boolean) value = object.target.checked;

    props.setValue(object.target.id,value);
    setFocus(object.target.id);
  };

  return (
    <React.Fragment>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {getFormFields().map((fieldData) => {
          return (
            <div style={styles} key={Math.random()}>
              <InputComponent
                fieldData={fieldData}
                onChangeHandler={onChangeHandler}
                notificationDetails={props.fieldDetails}
              />
            </div>
          );
        })}
      </div>
      <div>
        <Button variant="contained" color="primary" onClick={submitHandler}>
          Submit
        </Button>
      </div>
    </React.Fragment>
  );
}

export default FormComponent;
