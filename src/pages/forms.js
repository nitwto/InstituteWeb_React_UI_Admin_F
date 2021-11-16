import React, { useState } from "react";
import NotificationForm from "../components/NotificationForm";
import Login from "../components/Login";
import { useSelector, useDispatch } from "react-redux";
import FileUploadForm from "./uploads";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { makeStyles } from "@material-ui/styles";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { authActions } from "../store/authSlice";
import RightsForm from "../components/RightsForm";
import EditorForm from "../containers/EditorForm";
import PageEditorComponent from "../components/PageEditorComponent";
import NewPageForm from "../components/NewPageForm";
import PlacementForm from "../components/PlacementForm";
import AllUploadedFiles from "./allFiles";
import CreatePageWithJSON from "../components/CreatePageWithJSON";
import NavigationForm from "../containers/NavigationForm";
import RecentFile from "../pages/recentFile";
import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@material-ui/core";

// Add other forms and route using react-router-dom

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Forms() {
  const classes = useStyles();
  const [presentTab, setPresentTab] = useState("Home");
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElProfile, setAnchorElProfile] = useState(null);
  const [editPageDetails, setEditPageDetails] = useState(null);
  const dispatch = useDispatch();
  const authDetails = useSelector((state) => state.auth);
  const [alertArray, setAlertArray] = useState([]);

  const drawerWidth = 240;

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseProfile = () => {
    setAnchorElProfile(null);
  };

  const handleMenuProfile = (event) => {
    setAnchorElProfile(event.currentTarget);
  };

  const handlePresentTab = (tab) => {
    setPresentTab(tab);
  };

  const handleEditPageDetails = (data) => {
    setEditPageDetails(data);
  };

  const addAlert = (alert) => {
    setAlertArray((prevState) => {
      let newState = [...prevState];
      newState.push(alert);
      return newState;
    });
    console.log(alertArray);
  };

  const handleSignOut = async () => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(),
    };
    const response = await fetch(
      "http:///insti-web-backend.herokuapp.com/api/signout",
      requestOptions
    );
    if (!response) {
      return;
    }
    dispatch(authActions.reset());
    handlePresentTab("Home");
  };

  return (
    <React.Fragment>
      <div className={classes.root}>
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
          style={{ marginBottom: "90px" }}
        >
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Portal for Website
            </Typography>
            {authDetails.user ? (
              <Button
                color="inherit"
                onClick={() => {
                  handleSignOut();
                  handleCloseProfile();
                }}
              >
                Logout
              </Button>
            ) : (
              <Button
                color="inherit"
                onClick={() => {
                  setPresentTab("Login");
                }}
              >
                Login
              </Button>
            )}
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>
            <List>
              <ListItem
                button
                onClick={() => {
                  setPresentTab("Home");
                  handleClose();
                }}
              >
                Home
              </ListItem>
              <Divider />
              {authDetails.user && (
                <div>
                  <ListItem
                    button
                    onClick={() => {
                      setPresentTab("NotificationForm");
                      handleClose();
                    }}
                  >
                    Notification Form
                  </ListItem>
                  <Divider />
                </div>
              )}
              {authDetails.user && (
                <div>
                  <ListItem
                    button
                    onClick={() => {
                      setPresentTab("RightsForm");
                      handleClose();
                    }}
                  >
                    Rights Form
                  </ListItem>
                  <Divider />
                </div>
              )}
              {authDetails.user && (
                <div>
                  <ListItem
                    button
                    onClick={() => {
                      setPresentTab("EditorForm");
                      handleClose();
                    }}
                  >
                    Editor Form
                  </ListItem>
                  <Divider />
                </div>
              )}
              {authDetails.user && (
                <div>
                  <ListItem
                    button
                    onClick={() => {
                      setPresentTab("FileUploadForm");
                      handleClose();
                    }}
                  >
                    Upload File
                  </ListItem>
                  <Divider />
                </div>
              )}
              {authDetails.user && (
                <div>
                  <ListItem
                    button
                    onClick={() => {
                      setPresentTab("PlacementForm");
                      handleClose();
                    }}
                  >
                    Placement Form
                  </ListItem>
                  <Divider />
                </div>
              )}
              {authDetails.user && (
                <div>
                  <ListItem
                    button
                    onClick={() => {
                      setPresentTab("AllUploadedFiles");
                      handleClose();
                    }}
                  >
                    All Uploaded Files
                  </ListItem>
                  <Divider />
                </div>
              )}
              {authDetails.user && (
                <div>
                  <ListItem
                    button
                    onClick={() => {
                      setPresentTab("CreatePageWithJSON");
                      handleClose();
                    }}
                  >
                    Create Page With JSON
                  </ListItem>
                  <Divider />
                </div>
              )}
              {authDetails.user && (
                <div>
                  <ListItem
                    button
                    onClick={() => {
                      setPresentTab("NavigationForm");
                      handleClose();
                    }}
                  >
                    Navigation Form
                  </ListItem>
                  <Divider />
                </div>
              )}
            </List>
          </Box>
        </Drawer>
      </div>
      <div style={{ margin: "65px 0px 0px 240px" }}>
        <div>{alertArray}</div>
        {presentTab === "Home" && (
          <h1>Welcome To The Institute Website Portal</h1>
        )}
        {presentTab === "NotificationForm" && (
          <div>
            <NotificationForm addAlert={addAlert} token={authDetails.token} />
          </div>
        )}
        {presentTab === "Login" && (
          <Login handleTab={handlePresentTab} addAlert={addAlert} />
        )}
        {presentTab === "RightsForm" && (
          <RightsForm handleTab={handlePresentTab} addAlert={addAlert} />
        )}
        {presentTab === "EditorForm" && (
          <EditorForm
            handleTab={handlePresentTab}
            addAlert={addAlert}
            handlePageChange={handleEditPageDetails}
            token={authDetails.token}
          />
        )}
        {presentTab === "PageEditor" && (
          <PageEditorComponent
            pageDetails={editPageDetails}
            handleTab={handlePresentTab}
            addAlert={addAlert}
            token={authDetails.token}
          />
        )}

        {presentTab === "NewPageForm" && (
          <NewPageForm
            handleTab={handlePresentTab}
            addAlert={addAlert}
            token={authDetails.token}
          />
        )}
        {presentTab === "FileUploadForm" && (
          <div>
            <FileUploadForm
              addAlert={addAlert}
              token={authDetails.token}
              setPresentTab={setPresentTab}
            />
          </div>
        )}
        {presentTab === "PlacementForm" && (
          <div>
            <PlacementForm addAlert={addAlert} token={authDetails.token} />
          </div>
        )}
        {presentTab === "AllUploadedFiles" && (
          <div>
            <AllUploadedFiles addAlert={addAlert} token={authDetails.token} />
          </div>
        )}
        {presentTab === "RecentFile" && (
          <div>
            <RecentFile addAlert={addAlert} token={authDetails.token} />
          </div>
        )}
        {presentTab === "CreatePageWithJSON" && (
          <div>
            <CreatePageWithJSON addAlert={addAlert} token={authDetails.token} />
          </div>
        )}
        {presentTab === "NavigationForm" && (
          <div>
            <NavigationForm addAlert={addAlert} token={authDetails.token} />
          </div>
        )}
      </div>
    </React.Fragment>
  );
}
