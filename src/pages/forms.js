import React, { useState } from "react";
import NotificationForm from "../components/NotificationForm";
import Login from "../components/Login";
import { useSelector, useDispatch } from "react-redux";
import AlertComponent from "../components/AlertComponent";

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
import { Collapse } from "@material-ui/core";
import { Alert } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

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
  const [successAlert, setSuccessAlert] = useState(false);
  const [alertTextArray, setAlertTextArray] = useState("");
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

  const handleSuccessAlert = (text) => {
    setSuccessAlert(true);
    setAlertTextArray(text);
  };

  const addAlert = (alert) => {
    setAlertArray((prevState) => {
      let newState = [...prevState];
      newState.push(alert);
      return newState;
    });
    console.log(alertArray);
  }

  const handleSignOut = async () => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(),
    };
    const response = await fetch(
      "http://localhost:8000/api/signout",
      requestOptions
    );
    if (!response) {
      return;
    }

    dispatch(authActions.reset());
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
              <MenuItem
                onClick={() => {
                  setPresentTab("NotificationForm");
                  handleClose();
                }}
              >
                Notification Form
              </MenuItem>
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
      <div>
        {alertArray}
      </div>
      {presentTab === "Home" && (
        <h1>Welcome To The Institute Website Portal</h1>
      )}
      {presentTab === "NotificationForm" && (
        <div>
          <NotificationForm addAlert={addAlert}/>
        </div>
      )}
      {presentTab === "Login" && <Login handleTab={handlePresentTab} addAlert={addAlert}/>}
    </React.Fragment>
  );
}
