import React from 'react'
import { STATIC_API } from '../constants/extras';


export default function GetYearFiles({ year , files }) {

  if(year.length !== 4){
    return(
      <div>
        
      </div>
    )
  }
  let temp = [];

  const getFiles = () => {
    
    files.forEach((file) => {
      const fileYear = file.createdAt.substring(0,4);
      // console.log(fileYear);
      if(fileYear === year){
        temp.push(file);
      }
    });

  };

  const copyLink = (path1) => (e) => {
    e.preventDefault();
  
    /* Copy the text inside the text field */
    navigator.clipboard.writeText(path1);

    /* Alert the copied text */
    alert("Copied the link");
  }

  return (
    <div>
      {getFiles()}
      <br/>
      {temp.length === 0 && (
        <h5>{`${temp.length} files were Uploaded in ${year}`}</h5>
      )}
      {temp.length !== 0 && (

        <div>
          <h5>{`${temp.length} files were Uploaded in ${year}`}</h5>

           <section className="section section-lg bg-default">
            <div className="container">
              <div className="row offset-md-top-45 justify-content-sm-center">
                <div className="col-md-10 ">
                  <table className="table table-custom table-fixed table-hover-rows" data-responsive="true">
                    <tbody>
                      <tr>
                        <th className="text-center">Title</th>
                        <th className="text-center">Description</th>
                        <th className="text-center">Departments</th>
                        <th className="text-center">File</th>
                      </tr>
                      
                      { 
                        temp.map((value, index) => {
                          let path = value.file_path;
                          let path1 = path.replace(/\\/g, "/");
                          path1 = STATIC_API + "/" + path1;
                          return(
                            <tr>
                              <td className="text-center">{value.title}</td>
                              <td className="text-center">{value.description}</td>
                              <td className="text-center">{value.departments}</td>
                              <td className="text-center">
                              <a href={path1} className="link-primary" rel="noreferrer" target = "_blank"><button >open</button>
                              </a>
                              {" "}
                              <button onClick={copyLink(path1)} >Copy Link</button>
                              </td>
                            </tr>
                          )
                        })
                      
                      }

                    </tbody></table>
                </div>
              </div>
            </div>
          </section>
        </div>


        

      )}

    </div>
  )
}
