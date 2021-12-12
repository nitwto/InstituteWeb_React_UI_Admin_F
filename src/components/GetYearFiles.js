import { Button, Grid, Link, List, ListItemText, ListSubheader, TextField } from '@material-ui/core';
import { Box } from '@material-ui/system';
import React, { useState } from 'react'
import { STATIC_API } from '../constants/extras';
import SearchIcon from "@mui/icons-material/Search";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';


export default function GetYearFiles({ year , files }) {
  const [searchString, setSearchString] = useState("");

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

          <Grid container direction="column" marginTop="10vh">
            <Box sx={{ display: "flex", alignItems: "flex-end", margin: "auto" }}>
              <SearchIcon sx={{ color: "action.active", mr: 2, my: 0.5 }} />
              <TextField
                id="input-with-sx"
                label="Search with title, departments"
                variant="standard"
                onChange={(e) => setSearchString(e.target.value)}
              />
            </Box>
            <List
              component="nav"
              aria-labelledby="nested-list-subheader"
              subheader={
                <ListSubheader
                  component="div"
                  id="nested-list-subheader"
                ></ListSubheader>
              }
            >
              <table style={{ width: "80%", margin: "auto", marginTop: "2rem" }}>
                <thead>
                  <tr
                    style={{
                      backgroundColor: "#1976d2",
                      height: "2.5rem",
                      fontSize: "1.3rem",
                      color: "white",
                    }}
                  >
                    <th
                      style={{ textAlign: "center", fontWeight: "600" }}
                    >
                      Title
                    </th>
                    <th
                      style={{ textAlign: "center", fontWeight: "600" }}
                    >
                      Description
                    </th>
                    <th
                      style={{ textAlign: "center", fontWeight: "600" }}
                    >
                      Departments
                    </th>
                    <th
                      style={{ textAlign: "center", fontWeight: "600" }}
                    >
                      File
                    </th>
                  </tr>
                </thead>
                {temp
                  .filter(
                    (item) =>
                      item.title.toLowerCase().includes(searchString.toLowerCase()) ||
                      item.description.toLowerCase().includes(searchString.toLowerCase()) ||
                      item.departments.toLowerCase().includes(searchString.toLowerCase())
                  )
                  .map((item) => {
                    let path = item.file_path;
                    let path1 = path.replace(/\\/g, "/");
                    path1 = STATIC_API + "/" + path1;
                    return (
                    <tr>
                      <td>
                        <ListItemText>
                          {item.title}
                        </ListItemText>
                      </td>
                      <td>
                        <ListItemText>
                          {item.description}
                        </ListItemText>
                      </td>
                      <td>
                        <ListItemText>
                          {item.departments}
                        </ListItemText>
                      </td>
                      <td>
                        
                        <Link href={path1} className="link-primary" rel="noreferrer" target = "_blank">
                          <Button
                            style={{ textTransform: "none" }}
                          >
                            <ListItemText>Open</ListItemText>
                            
                          </Button>
                        </Link>
                        <Button
                          variant="contained"
                          endIcon={<ContentCopyIcon />}
                          onClick={copyLink(path1)}
                        >
                        </Button>
                      </td>
                    </tr>
                    )  
                })}
              </table>
            </List>
          </Grid>

           {/* <section className="section section-lg bg-default">
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
          </section> */}
        </div>
      )}

    </div>
  )
}
