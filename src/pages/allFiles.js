import axios from 'axios';
import React, { useState , useEffect} from 'react';
import GetYearFiles from '../components/GetYearFiles';
import { API } from '../constants/extras';


export default function AllFiles(props) {

  const [values, setvalues] = useState([]);
  const [year, setyear] = useState("");


  const handleChange = (event) => {
    // console.log(event.target.value);
    setyear(event.target.value);
    
  };

  useEffect(() => {
    const preload = () => {
      axios.get(`${API}/getAllFiles`,
      {headers: {
        'Authorization': `Bearer ${props.token}`,
      }}
      )
      .then((response) => {
        setvalues(response.data);
      })
      .catch((error) => {
          console.log(error);
      });
    }
    preload();
  }, [ props.token])



  return (
    <section className="section section-lg bg-default">
      <div className="container">
        <div className="col-sm-10 offset-1">
          <h2 className="fw-bold"> {year==="" || year==="Select Year" ? "" : year} Uploaded Documents</h2>
          <hr className="divider bg-madison" />
          <br/>

          <div className="container col-sm-8 offset 2">
            
            <select className="form-select" onChange={handleChange}>
              <option selected>Select Year</option>
              <option value="2022">2022</option>
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

      </div>
    </section>
  )
}
