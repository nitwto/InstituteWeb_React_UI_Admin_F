import axios from "axios";
import React, { useEffect, useState } from "react";
import { API, STATIC_API } from "../constants/extras";
import { Typography } from "@material-ui/core";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Grid } from "@material-ui/core";

const DataStyles = {
  fontWeight: "bold",
  color: "#4e7207",
  margin: "2%",
};

const ButtonTextStyles = {
  fontWeight: "bold",
  padding: "2%",
};

export default function RecentFile() {
  const [link, setLink] = useState("");
  const [fileData, setFileData] = useState(null);
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    if (fileData) {
      console.log(fileData);
      setIsReady(true);
    }
  }, [fileData]);

  useEffect(() => {
    axios
      .get(`${API}/getRecentFile`)
      .then((response) => {
        // console.log(response.data.my_path);
        let path = response.data.file_path;
        let path1 = path.replace(/\\/g, "/");
        setLink(STATIC_API + "/" + path1);
        // console.log(link);
        // console.log(response.data);
        if (response.data) {
          setFileData(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });

  const copyLink = () => {
    var copyText = document.getElementById("myLink");
    /* Select the text field */
    // copyText.select();
    // copyText.setSelectionRange(0, 99999); /* For mobile devices */

    /* Copy the text inside the text field */
    navigator.clipboard.writeText(copyText.textContent);

    /* Alert the copied text */
    alert("Copied the link");
  };

  return (
    <Grid container>
      {isReady === true ? (
        <Grid container direction="column" textAlign={"left"} padding="20px">
          <Typography
            variant="h3"
            fontWeight="bold"
            style={{
              backgroundColor: "#1DB9C3",
              color: "#fff",
              padding: "3%",
              textAlign: "center",
            }}
          >
            Last uploaded file
          </Typography>
          <Typography variant="h5" style={DataStyles}>
            <span style={{ color: "gray" }}>Title : </span>
            {fileData.title}
          </Typography>
          <Typography variant="h5" style={DataStyles}>
            <span style={{ color: "gray" }}>Description : </span>
            {fileData.description}
          </Typography>
          <Typography variant="h5" style={DataStyles}>
            <span style={{ color: "gray" }}>Departments : </span>
            {fileData.departments}
          </Typography>
          <Typography variant="h5" style={DataStyles}>
            <span style={{ color: "gray" }}>File Type : </span>
            {fileData.file_mimetype}
          </Typography>
          <Typography variant="h5" style={DataStyles}>
            <span style={{ color: "gray" }}>Uploaded At : </span>
            {fileData.createdAt}
          </Typography>
          <Typography variant="h5" style={DataStyles}>
            <span style={{ color: "gray" }}>File Link : </span>
            <span id="myLink">{link}</span>
          </Typography>
          <Grid container direction="row" justifyContent={"space-around"}>
            <Grid md={5}>
              <Button
                variant="contained"
                onClick={copyLink}
                fullWidth
                endIcon={<ContentCopyIcon />}
              >
                <Typography variant="h5" style={ButtonTextStyles}>
                  Copy Link
                </Typography>
              </Button>
            </Grid>
            <Grid md={5}>
              <a
                href={link}
                className="link-primary"
                rel="noreferrer"
                target="_blank"
                style={{ textDecoration: "none" }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  endIcon={<SendIcon />}
                >
                  <Typography variant="h5" style={ButtonTextStyles}>
                    Go to file
                  </Typography>
                </Button>
              </a>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        ""
      )}
    </Grid>
  );
}
