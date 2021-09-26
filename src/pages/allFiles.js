import axios from 'axios';
import React, { useState , useEffect} from 'react';
import GetYearFiles from '../components/GetYearFiles';
import { API, STATIC_API } from '../constants/extras';


export default function AllFiles() {

  const [values, setvalues] = useState([]);
  const [year, setyear] = useState("");

  const preload = () => {
    axios.get(`${API}/getAllFiles`)
    .then((response) => {
      setvalues(response.data);
      console.log(response.data);
    })
    .catch((error) => {
        console.log(error);
    });
  }

  const handleChange = (event) => {
    // console.log(event.target.value);
    setyear(event.target.value);
    
  };

  useEffect(() => {
    preload();
  }, [])



  return (
    <section className="section section-lg bg-default">
      <div className="container">

        <div className="col-sm-10 offset-1">
          <h2 className="fw-bold"> {year=="" || year=="Select Year" ? "" : year} Uploaded Documents</h2>
          <hr className="divider bg-madison" />
          <br/>

          <div className="container col-sm-8 offset 2">
            
            <select className="form-select" onChange={handleChange}>
              <option selected>Select Year</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
              <option value="2019">2019</option>
              <option value="2018">2018</option>
            </select>
          </div>

          
            <div >
              <GetYearFiles year={year} files={values} >

              </GetYearFiles>
            </div>
              
          
        </div>




        {/* <div className="col-sm-10 offset-1">

          <h2 className="fw-bold"> All Uploaded Documents </h2>
          <hr className="divider bg-madison" />

          <div>

          </div>

          { values.map((val, index) => {
            let path = val.file_path;
            let path1 = path.replace(/\\/g, "/");
            path1 = STATIC_API + "/" + path1;

            return(
              <div>
                <h3 className="fw-bold">Title : {val.title}</h3>

                <h4 className="fw"> Description : {val.description} </h4>

                <h4 className="fw"> Departments : {val.departments} </h4>

                <h4 className="fw"><a href={path1} target = "_blank">open file</a></h4>

                <hr className="divider bg-madison" />
                <br></br>
              </div>
            )
          }
            
          )}

        </div> */}
      </div>
    </section>
  )
}
