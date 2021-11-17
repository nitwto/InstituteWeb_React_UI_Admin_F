import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Button,
  Grid,
} from "@material-ui/core";
import AlertComponent from "../components/AlertComponent";
import { TEST_API } from "../constants/extras";
import { text_cleaner } from "../util/textCleaners";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
export const AllUrls = (props) => {
  const [allUrls, setAllUrls] = useState([]);
  const [searchString, setSearchString] = useState("");
  const { token, addAlert } = props;

  useEffect(() => {
    async function fetchAllUrls() {
      const requestOptions = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await fetch(`${TEST_API}/page/sitemap`, requestOptions);
      if (!response) {
        addAlert(
          <AlertComponent
            type="error"
            text="There are some issues to be encountered. Please try again later."
          />
        );
        return;
      }
      const data = await response.json();
      setAllUrls(data);
    }

    fetchAllUrls();
  }, [token, addAlert]);

  const onSubmit = async (url) => {
    if (true) {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.token}`,
        },
        body: JSON.stringify({ url }),
      };
      const response = await fetch(
        "https://insti-web-backend.herokuapp.com/api/page/get",
        requestOptions
      );
      const data = await response.json();
      console.log(data);
      if (data.error) {
        if (response.status === 400) {
          props.addAlert(
            <AlertComponent
              type="error"
              text="Sorry, the given url doesn't exist or the server is down for a while."
            />
          );
        } else if (response.status === 403) {
          props.addAlert(
            <AlertComponent
              type="error"
              text="Sorry!! You are not authorized to access or edit the given page."
            />
          );
        }
      } else {
        props.handlePageChange(data);
        props.handleTab("PageEditor");
      }
    }
  };

  allUrls.sort(function (item1, item2) {
    if (item1.url < item2.url) {
      return -1;
    } else if (item1.url > item2.url) {
      return 1;
    } else return 0;
  });

  return (
    <Grid container direction="column" margin='2vw'>
      <Box sx={{ display: "flex", alignItems: "flex-end", margin: "auto" }}>
        <SearchIcon sx={{ color: "action.active", mr: 2, my: 0.5 }} />
        <TextField
          id="input-with-sx"
          label="Search with name, url, path"
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
        <Grid container direction="row">
          {allUrls
            .filter(
              (item) =>
                item.title.toLowerCase().includes(searchString.toLowerCase()) ||
                item.path.toLowerCase().includes(searchString.toLowerCase()) ||
                item.url.toLowerCase().includes(searchString.toLowerCase())
            )
            .map((item) => (
              <Grid item md={6}>
                {" "}
                <ListItem>
                  <Button
                    onClick={() => {
                      onSubmit(item.url);
                    }}
                    style={{ textTransform: "none" }}
                  >
                    <ListItemText>
                      {`[${text_cleaner(item.path)}] ${text_cleaner(
                        "/" + item.title
                      )}`}
                    </ListItemText>
                  </Button>
                </ListItem>
              </Grid>
            ))}
        </Grid>
      </List>
    </Grid>
  );
};
