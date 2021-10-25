import axios from 'axios';
import React , { useState } from 'react';
import { API, STATIC_API } from '../constants/extras';

export default function RecentFile() {

  const [link, setLink] = useState("")
  const [title, settitle] = useState("")
  const [description, setdescription] = useState("")
  const [departments, setdepartments] = useState("")

    const getUploadedFile = () => {
      axios.get(`${API}/getRecentFile`)
      .then((response) => {
        // console.log(response.data.my_path);
        let path = response.data.file_path;
        let path1 = path.replace(/\\/g, "/");
        console.log(path1);
        setLink(STATIC_API + "/" + path1);
        // console.log(link);
        settitle(response.data.title);
        setdescription(response.data.description);
        setdepartments(response.data.departments);
      })
      .catch((error) => {
        console.log(error);
      });
    }

    const copyLink = () => {
      var copyText = document.getElementById("myLink");
      /* Select the text field */
      // copyText.select();
      // copyText.setSelectionRange(0, 99999); /* For mobile devices */

      /* Copy the text inside the text field */
      navigator.clipboard.writeText(copyText.textContent);

      /* Alert the copied text */
      alert("Copied the link");
    }

    return (
      <section className="section section-lg bg-default">

      <h2 className="fw-bold">Recent Uploaded File</h2>
      <hr className="divider bg-madison" />


      <div className="container">
        <div className="col-sm-10 offset-1">
          {getUploadedFile()}
          <h3 className="fw-bold">Title : {title}</h3>

          <div className="row">
            <div className="col-4">
              <h4 className="fw-bold"> Description </h4>
              <h4 className="fw"> {description} </h4>
            </div>
            <div className="col-4">
              <h4 className="fw-bold"> Departments </h4>
              <h4 className="fw"> {departments} </h4>
            </div>
            <div className="col-4">
              <h4 className="fw-bold"> <a href={link} className="link-primary" rel="noreferrer" target = "_blank"><u>Open File</u></a> </h4>
              <p value={link} className="fw-bold" id="myLink">{link}</p> <button className="btn btn-info btn-sm" onClick={copyLink}>Copy Link</button>
            </div>
          </div>

        </div>
      </div>
    </section>
    )
}
