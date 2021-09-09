import React, { useRef, useState } from "react";

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
  Link,
} from "@material-ui/core/";

export default function Login() {
  const [signUp, setSignUp] = useState(true);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [zeroSubmission, setZeroSubmission] = useState(true);
  const [focus, setFocus] = useState(false);
  const userNameRef = useRef(null);
  const passwordRef = useRef(null);
  const emailRef = useRef(null);

  let userNameError = false;
  let passwordError = false;
  let emailError = false;
  let userNameErrorText = "";
  let passwordErrorText = "";
  let emailErrorText = "";

  const styles = {
    margin: "10px",
    width: "300px",
  };

  const resetAll = () => {
    setUserName("");
    setPassword("");
    setEmail("");
    setFocus(false);
    setZeroSubmission(true);
  };

  const onChangeHandler = (object) => {
    const value = object.target.value;
    const obj = object.target.id;

    if (obj === "userName") {
      setUserName(value);
    } else if (obj === "password") {
      setPassword(value);
    } else {
      setEmail(value);
    }
  };

  const isCorrect = () => {
    if (
      email === "" ||
      password === "" ||
      password.length < 3
    ) {
      return false;
    }

    if (signUp && (userName === "" || userName.length < 3)) return false;

    return true;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (isCorrect()) {
      if (signUp) {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: userName,
            email,
            password,
          }),
        };
        const response = await fetch(
          "http://localhost:8000/api/signup",
          requestOptions
        );
        if (!response) {
          return;
        }
        const data = await response.json();
        console.log(data);
      } else {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
          }),
        };
        const response = await fetch(
          "http://localhost:8000/api/signin",
          requestOptions
        );
        if (!response) {
          return;
        }
        const data = await response.json();
        console.log(data, "go");
      }
      resetAll();
    } else {
      setZeroSubmission(false);
      setFocus(true);
    }
  };

  return (
    <React.Fragment>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "column",
          alignContent: "center",
        }}
      >
        <FormControl fullWidth={true} style={styles} required>
          <InputLabel htmlFor={"email"}>{"Email"}</InputLabel>
          <Input
            id={"email"}
            aria-describedby="my-helper-text"
            value={email}
            onChange={(obj) => onChangeHandler(obj)}
            error={emailError}
            inputRef={emailRef}
          />
          <FormHelperText id="my-helper-text">{emailErrorText}</FormHelperText>
        </FormControl>
        {signUp && (
          <FormControl fullWidth={true} style={styles} required>
            <InputLabel htmlFor={"userName"}>{"UserName"}</InputLabel>
            <Input
              id={"userName"}
              aria-describedby="my-helper-text"
              value={userName}
              onChange={(obj) => onChangeHandler(obj)}
              error={userNameError}
              inputRef={userNameRef}
            />
            <FormHelperText id="my-helper-text">
              {userNameErrorText}
            </FormHelperText>
          </FormControl>
        )}

        <FormControl fullWidth={true} style={styles} required>
          <InputLabel htmlFor={"password"}>{"Password"}</InputLabel>
          <Input
            id={"password"}
            aria-describedby="my-helper-text"
            value={password}
            onChange={(obj) => onChangeHandler(obj)}
            error={passwordError}
            inputRef={passwordRef}
          />
          <FormHelperText id="my-helper-text">
            {passwordErrorText}
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
      </div>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}
      >
        <Link
          href="#"
          onClick={() => {
            setSignUp((prevState) => !prevState);
          }}
        >
          {signUp ? "Already a user. SignIn" : "Create a new account"}
        </Link>
      </div>
    </React.Fragment>
  );
}
