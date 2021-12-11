import React, { useState } from "react";
import { Autocomplete, Typography } from "@material-ui/core";
import axios from "axios";
import PublishIcon from "@mui/icons-material/Publish";
import { DEPARTMENTSNAMES, API } from "../constants/extras";
import AlertComponent from "../components/AlertComponent";
import {
  FormControl,
  Input,
  InputLabel,
  TextField,
  Button,
} from "@material-ui/core/";

import { Grid } from "@material-ui/core";
import RecentFile from "./recentFile";

const ButtonTextStyles = {
  fontWeight: "bold",
  padding: "2%",
};

function Uploads(props) {
  let initial = new FormData();
  const [values, setValues] = useState({
    title: "",
    description: "",
    file: "",
    departments: "",
    loading: false,
    error: "",
    uploadedFile: "",
    // getaRedirect: false,
    formData: initial,
  });

  const {
    title,
    description,
    departments,
    loading,
    file,
    uploadedFile,
    formData,
  } = values;

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: "", loading: true });

    if (!title || !description || !departments || !file) {
      const error = "Please include all fields";
      setValues({ ...values, error: error });
      props.addAlert(<AlertComponent type="error" text={error} />);

      return;
    }

    axios
      .post(`${API}/uploadFile`, formData, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: `Bearer ${props.token}`,
        },
      })
      .then((data) => {
        setValues({
          ...values,
          title: "",
          description: "",
          departments: "",
          file: "",
          error: "",
          loading: false,
          uploadedFile: data.data.title,
        });
        props.setPresentTab("FileUploadForm");
        props.addAlert(
          <AlertComponent
            type="success"
            text="The File has been uploaded successfully"
          />
        );
      });
  };

  const handleChange = (event, name) => {
    let value = "";
    if (name === "file") {
      value = event.target.files[0];
    } else {
      value = event.target.value;
    }
    formData.set(name, value);
    setValues({ ...values, [name]: value });

    if (!title || !description || !departments || !file) {
      //
    } else {
      setValues({ ...values, error: "" });
    }
  };

  const viewFileMessage = () => (
    <div
      className="alert alert-info mt-3"
      style={{ display: uploadedFile ? "" : "none" }}
    >
      <h4>
        {" "}
        <a href="/recent-upload" target="_blank">
          View Uploaded File
        </a>{" "}
      </h4>
    </div>
  );

  const loadingMessage = () => (
    <div
      className="alert alert-success mt-3"
      style={{ display: loading ? "" : "none" }}
    >
      <h4>Loading...</h4>
    </div>
  );

  const styles = {
    margin: "10px",
    width: "300px",
  };

  return (
    <React.Fragment>
      <Grid container direction="row">
        <Grid
          container
          direction="column"
          md={6}
          style={{ borderRight: "solid", margin: "0 auto", padding: "20px" }}
        >
          <Grid>
            <Typography
              variant="h3"
              fontWeight="bold"
              style={{
                backgroundColor: "#7027A0",
                color: "#fff",
                padding: "3%",
              }}
            >
              Upload Files
            </Typography>
            <Typography variant="h5" style={{ color: "#4e7207" }}>
              {viewFileMessage()}
            </Typography>
            <Typography variant="h5" style={{ color: "#4e7207" }}>
              {loadingMessage()}
            </Typography>
          </Grid>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              flexDirection: "column",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <FormControl fullWidth={true} style={styles} required>
              <InputLabel>{"Title"}</InputLabel>
              <Input
                id={"title"}
                value={title}
                onChange={(obj) => handleChange(obj, "title")}
              />
            </FormControl>

            <FormControl fullWidth={true} style={styles} required>
              <InputLabel>{"Description"}</InputLabel>
              <Input
                id={"description"}
                value={description}
                onChange={(obj) => handleChange(obj, "description")}
              />
            </FormControl>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              flexDirection: "column",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <div className="row">
              <div className="col-6 offset-2">
                <label>
                  <input
                    onChange={(obj) => handleChange(obj, "file")}
                    type="file"
                    name="file"
                    multiple
                    required
                    placeholder="choose a file"
                  />
                </label>

                {values.file && (
                  <img width="500px"
                    src={URL.createObjectURL(file)}
                    alt="preview not available for this file type"
                  />
                )}
              </div>
            </div>
          </div>

          <br></br>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              flexDirection: "column",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <Autocomplete
              className="form-wrap"
              options={DEPARTMENTSNAMES}
              multiple
              style={styles}
              // defaultValue={[DEPARTMENTS[0]]}
              onChange={(event, value) => {
                formData.set("departments", value);

                setValues({ ...values, departments: value });
              }}
              getOptionLabel={(option) => option}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Choose Departments"
                  variant="standard"
                  placeholder="Departments"
                />
              )}
            />
          </div>

          <br></br>
          <Grid container direction="row" justifyContent={"center"}>
            <Grid md={6}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={(event) => onSubmit(event)}
                endIcon={<PublishIcon />}
              >
                <Typography variant="h6" style={ButtonTextStyles}>
                  Upload
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid md={6}>
          <RecentFile />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default Uploads;
