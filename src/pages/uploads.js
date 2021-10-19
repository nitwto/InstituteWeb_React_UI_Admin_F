import React, { useState , useEffect} from 'react';
import { Autocomplete } from '@material-ui/core'
import axios from 'axios';

import { DEPARTMENTS , API} from "../constants/extras";
import AlertComponent from "../components/AlertComponent";
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
    formData: initial
  });

  const {
    title,
    description,
    departments,
    loading,
    error,
    file,
    uploadedFile,
    formData
  } = values;

  const preload = () => {
    setValues({ ...values, formData: new FormData() });
  };

  useEffect(() => {
    preload();
  }, []);

  const onSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: "", loading: true });

    if(!title || !description || !departments || !file){
      
      const error = "Please include all fields";
      setValues({ ...values, error: error });
      props.addAlert(
        <AlertComponent
          type="error"
          text={error}
        />
      );
      return;
    }

    axios.post(`${API}/uploadFile`,formData,{
      headers: {
        'content-type': 'multipart/form-data',
        'Authorization': `Bearer ${props.token}`,
      }
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
        uploadedFile: data.data.title
      })
      props.addAlert(
        <AlertComponent
          type="success"
          text="The File has been uploaded successfully"
        />
      );
      
    })
    
  };

  const handleChange = (event, name) => {
    let value = "";
    if(name == "file") {
      value = event.target.files[0];
    }
    else {
      value = event.target.value;
    }
    formData.set(name, value);
    setValues({ ...values, [name]: value });
    
    if(!title || !description || !departments || !file){
      // 
    }
    else{
      setValues({ ...values, error: "" });
    }
  };

  const successMessage = () => (
    <div
      className="alert alert-success mt-3"
      style={{ display: uploadedFile ? "" : "none" }}
    >
      <h4>{uploadedFile} Uploaded successfully</h4>

    </div>
  );

  const viewFileMessage = () => (
    <div
      className="alert alert-info mt-3"
      style={{ display: uploadedFile ? "" : "none" }}
    >
      <h4> <a href="/recent-upload" target = "_blank">View Uploaded File</a> </h4>

    </div>
  );

  const errorMessage = () => (
    <div
      className="alert alert-danger mt-3"
      style={{ display: error!=="" ? "" : "none" }}
    >
      <h4>{error}</h4>
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

      <div>
        <h2>File Upload Form</h2>

        {/* <h4>{errorMessage()}</h4> */}
        {/* <h4>{successMessage()}</h4> */}
        <h4>{viewFileMessage()}</h4>
        <h4>{loadingMessage()}</h4>

      </div>
      
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            flexDirection: "column",
            alignContent: "center",
            justifyContent: "center"
          }}
        >
    
          <FormControl fullWidth={true} style={styles} required>
            <InputLabel >{"Title"}</InputLabel>
            <Input
              id={"title"}
              value={title}
              onChange={ (obj) => handleChange(obj, "title") }
            />
          </FormControl>

          <FormControl fullWidth={true} style={styles} required>
            <InputLabel >{"Description"}</InputLabel>
            <Input
              id={"description"}
              value={description}
              onChange={ (obj) => handleChange(obj, "description") }
            />
          </FormControl>
        </div>

        <div style={{
            display: "flex",
            flexWrap: "wrap",
            flexDirection: "column",
            alignContent: "center",
            justifyContent: "center"
        }}>
          <div className="row">
          <div className="col-6 offset-3">
            <label className="btn ">
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
              <img src={URL.createObjectURL(file)} alt="preview not available for this file type" />
            )}
            </div>
          </div>
        </div>
          
          <br></br>
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            flexDirection: "column",
            alignContent: "center",
            justifyContent: "center"
        }} >
          
            <Autocomplete
              className="form-wrap"
              options={DEPARTMENTS}
              multiple
              style={styles}
              // defaultValue={[DEPARTMENTS[0]]}
              onChange={(event, value) => {
                formData.set('departments',value);
                
                setValues({ ...values, departments: value })
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
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            style={{ marginLeft: "10px" }}
            variant="contained"
            color="primary"
            onClick={ (event) => onSubmit(event)}
          >
            Submit
          </Button>
        </div>

      </React.Fragment>

  );

}
  
export default Uploads;