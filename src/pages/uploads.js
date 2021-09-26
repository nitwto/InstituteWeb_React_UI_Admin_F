import React, { useState , useEffect} from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axios from 'axios';

import { DEPARTMENTS , API} from "../constants/extras";

function Uploads() {
  const [values, setValues] = useState({
    title: "",
    description: "",
    file: "",
    departments: "",
    loading: false,
    error: "",
    uploadedFile: "",
    // getaRedirect: false,
    formData: ""
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

  const onSubmit = event => {
    event.preventDefault();
    setValues({ ...values, error: "", loading: true });

    if(!title || !description || !departments || !file){
      
      const error = "Please include all fields";
      setValues({ ...values, error: error });
      return;
    }

    axios.post(`${API}/uploadFile`,formData,{
      headers: {
        'content-type': 'multipart/form-data'
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
      });
      
    })
    
  };

  const handleChange = name => event => {
    const value = name === "file" ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    // console.log(value);
    // console.log(event);
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
      <h4> <a href="/recent-upload">View Uploaded File</a> </h4>

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


  return (
      <section className="section section-lg bg-default">
        <div className="container">
          <div className="row justify-content-sm-center">
            <div className="col-sm-10 col-xl-8">
              <h2 className="fw-bold">File Upload Form</h2>

              <hr className="divider bg-madison" />
              <div className="offset-md-top-50 offset-top-40">
                <form className="rd-mailform text-start">
                  
                  {loadingMessage()}
                  {errorMessage()}
                  {successMessage()}
                  {viewFileMessage()}

                  <div className="row row-12">
                    
                    <div className="col-12">
                      <div className="form-wrap">
                        <label className="form-label form-label-outside" >Title</label>
                        <input className="form-input" type="text" name="title" data-constraints="@Required" value={title}
                          placeholder="Enter title"
                          onChange={handleChange("title")} />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-wrap">
                        <label className="form-label form-label-outside" htmlFor="contact-us-message">Description</label>
                        <textarea className="form-input" name="description" data-constraints="@Required" value={description}
                          placeholder="Enter description"
                          onChange={handleChange("description")} />
                      </div>
                    </div>
                  </div>
                  <div className="row justify-content-sm-center">
                    <div className="col-6">

                      <label className="btn ">
                        <input
                          onChange={handleChange("file")}
                          type="file"
                          name="file"
                          multiple
                          required
                          placeholder="choose a file"
                        />
                      </label>

                    </div>
                    <div className="col-6">

                      {values.file && (
                        <img src={URL.createObjectURL(file)} alt="preview not available for this file type" />
                      )}

                      {/* {values.file && [...values.file].map(
                        (f) => (
                          <img src={URL.createObjectURL(f)} />
                        )
                      )} */}

                      </div>
                    </div>

                    <br></br>
                    <Autocomplete
                      className="form-wrap"
                      options={DEPARTMENTS}
                      multiple
                      style={{width: 500}}
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

                  <div className="offset-top-20 text-center text-md-start">
                    <button className="btn button-primary" onClick={onSubmit} type="submit">Submit</button>
                  </div>

                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

  );

}
  
export default Uploads;