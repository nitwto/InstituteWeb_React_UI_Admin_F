import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Button,
} from "@material-ui/core";
import AlertComponent from "../components/AlertComponent";
import { API, TEST_API } from "../constants/extras";

export const AllUrls = (props) => {
  const [allUrls, setAllUrls] = useState([]);

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
        "http:///insti-web-backend.herokuapp.com/api/page/get",
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
      {allUrls.map((item) => (
        <ListItem>
          <Button
            onClick={() => {
              onSubmit(item.url);
            }}
          >
            <ListItemText>{item.url}</ListItemText>
          </Button>
        </ListItem>
      ))}
    </List>
  );
};
