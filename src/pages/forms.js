import React, { useState } from "react";
import NotificationForm from "../components/NotificationForm";
import Login from "../components/Login";
import { useSelector, useDispatch } from "react-redux";

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

  const open = Boolean(anchorEl);
  const openProfile = Boolean(anchorElProfile);

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
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem
                onClick={() => {
                  setPresentTab("Home");
                  handleClose();
                }}
              >
                Home
              </MenuItem>
              {authDetails.user && (
                <MenuItem
                  onClick={() => {
                    setPresentTab("NotificationForm");
                    handleClose();
                  }}
                >
                  Notification Form
                </MenuItem>
              )}
              {authDetails.user && (
                <MenuItem
                  onClick={() => {
                    setPresentTab("RightsForm");
                    handleClose();
                  }}
                >
                  Rights Form
                </MenuItem>
              )}
              {authDetails.user && (
                <MenuItem
                  onClick={() => {
                    setPresentTab("EditorForm");
                    handleClose();
                  }}
                >
                  Editor Form
                </MenuItem>
              )}
            </Menu>
            <Typography variant="h6" className={classes.title}>
              Portal for Website
            </Typography>
            {authDetails.user ? (
              <div>
                <IconButton
                  aria-label="account of current user"
                  aria-controls="profile-appbar"
                  aria-haspopup="true"
                  onClick={handleMenuProfile}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={openProfile}
                  onClose={handleCloseProfile}
                >
                  <MenuItem
                    onClick={() => {
                      handleSignOut();
                      handleCloseProfile();
                    }}
                  >
                    LogOut
                  </MenuItem>
                </Menu>
              </div>
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
      </div>
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
    </React.Fragment>
  );
}
