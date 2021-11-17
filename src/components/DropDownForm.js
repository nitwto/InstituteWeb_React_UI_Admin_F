import React, { useState, useEffect } from "react";
import {
    FormControl,
    Input,
    InputLabel,
    FormHelperText,
    Button,
    FormControlLabel,
    Checkbox,
    Select,
    MenuItem
} from "@material-ui/core/";
import AlertComponent from "../components/AlertComponent";
import { API } from "../constants/extras";

export default function DropDownForm(props) {
    const [updateNavigation, setUpdateNavigation] = useState(null);
    const [allNavigation, setAllNavigation] = useState([]);
    const [title, settitle] = useState("");
    const [route, setRoute] = useState("");
    const [priority, setPriority] = useState(1);
    const [is_path, setIsPath] = useState(false);
    const [is_internal, setIsInternal] = useState(false);
    const [zeroSubmission, setZeroSubmission] = useState(true);

    const { token, addAlert } = props;

    useEffect(() => {
        async function fetchAllNotifApi() {
            const requestOptions = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await fetch(
                `${API}/nav/getall`,
                requestOptions
            );
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
            setAllNavigation(data);
        }

        fetchAllNotifApi();
    }, [token, addAlert]);

    let titleError = false;
    let priorityError = false;
    let routeError = false;
    let titleErrorText = "";
    let priorityErrorText = "";
    let routeErrorText = "";

    const styles = {
        margin: "10px",
        width: "300px",
    };

    const resetAll = () => {
        settitle("");
        setPriority(1);
        setRoute("");
        setUpdateNavigation("");
        setIsPath(false);
        setIsInternal(false);
        setZeroSubmission(true);
    };

    const onChangeHandler = (object) => {
        var value = object.target.value;
        const obj = object.target.id;

        if (obj === "title") {
            settitle(value);
        } else if (obj === "route") {
            setRoute(value);
        } else if (obj === "is_internal") {
            value = object.target.checked;
            setIsInternal(value);
        } else if (obj === "priority") {
            setPriority(value);
        } else if (obj === "is_path") {
            value = object.target.checked;
            setIsPath(value);
        } else {
            setUpdateNavigation(value);
            console.log(updateNavigation);
        }
    };

    const isCorrect = () => {
        if (title === "" || title.length < 3 || priority < 0 || route.length === 0) {
            return false;
        }
        return true;
    };

    const getError = () => {
        if (title === "" || title.length < 3) {
            titleError = true;
            if (title === "") {
                titleErrorText = "title is required";
            } else {
                titleErrorText = "title needs to be of greater than 3 chars";
            }
        }
        if (route === "") {
            routeError = true;
            routeErrorText = "route is required";
        }
        if (priority < 0) {
            priorityError = true;
            priorityErrorText = "Priority can't be negative";
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (isCorrect()) {
            const requestOptions = {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${props.token}`
                },
                body: JSON.stringify({
                    "dropdowns" : [{
                        title,
                        route,
                        priority,
                        is_internal,
                        is_path,
                    }]
                }),
            };
            console.log(`${API}/nav/addDropdown/${updateNavigation._id}`);
            const response = await fetch(`${API}/nav/addDropdown/${updateNavigation._id}`, requestOptions);
            if (!response) {
                props.addAlert(<AlertComponent type="error" text={"Something unexpected happened. Please try again later."} />);
                return;
            }
            const data = await response.json();
            console.log(data);
            if (data.err) {
                props.addAlert(<AlertComponent type="error" text={data.err} />);
            } else {
                props.addAlert(
                    <AlertComponent
                        type="success"
                        text="New navigation dropdown has been added successfully"
                    />
                );
                resetAll();
            }
        } else {
            setZeroSubmission(false);
        }
    };

    if (!zeroSubmission) getError();

    const component = (
        <React.Fragment>
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    flexDirection: "column",
                    alignContent: "center",
                }}
            >
                <h2>Add Navigation Dropdown</h2>
            </div>
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    flexDirection: "column",
                    alignContent: "center",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "10px",
                    }}
                >
                    <Button
                        type="outline"
                        href="#"
                        onClick={() => {
                            props.shuffleForm();
                        }}
                    >
                        {"Add a new navigation button"}
                    </Button>
                </div>
                <div style={{ display: "flex", justifyContent: "space-around" }}>
                    <FormControl
                        variant="filled"
                        fullWidth={true}
                        style={styles}
                        required
                    >
                        <InputLabel id="nav-select-label">Navigation Tabs</InputLabel>
                        <Select
                            labelId="nav-select-label"
                            id="updateNavigation"
                            name="updateNavigation"
                            value={updateNavigation}
                            onChange={(obj) => onChangeHandler(obj)}
                        >
                            {allNavigation.map((nav) => {
                                return <MenuItem value={nav}>{nav.title}</MenuItem>;
                            })}
                        </Select>
                    </FormControl>
                </div>

                <FormControl fullWidth={true} style={styles} required>
                    <InputLabel htmlFor={"title"}>{"title"}</InputLabel>
                    <Input
                        id={"title"}
                        aria-describedby="my-helper-text"
                        value={title}
                        onChange={(obj) => onChangeHandler(obj)}
                        error={titleError}
                    />
                    <FormHelperText id="my-helper-text">{titleErrorText}</FormHelperText>
                </FormControl>
                <FormControl fullWidth={true} style={styles} required>
                    <InputLabel htmlFor={"route"}>{"route"}</InputLabel>
                    <Input
                        id={"route"}
                        aria-describedby="my-helper-text"
                        value={route}
                        onChange={(obj) => onChangeHandler(obj)}
                        error={routeError}
                    />
                    <FormHelperText id="my-helper-text">{routeErrorText}</FormHelperText>
                </FormControl>
                <FormControl fullWidth={true} style={styles} required>
                    <InputLabel htmlFor={"priority"}>{"priority"}</InputLabel>
                    <Input
                        type="number"
                        id={"priority"}
                        aria-describedby="my-helper-text"
                        inputProps={{ inputProps: { min: 0 } }}
                        value={priority}
                        onChange={(obj) => onChangeHandler(obj)}
                        error={priorityError}
                    />
                    <FormHelperText id="my-helper-text">
                        {priorityErrorText}
                    </FormHelperText>
                </FormControl>
                <FormControl fullWidth={true} style={styles}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={is_path}
                                onChange={(obj) => onChangeHandler(obj)}
                                id={"is_path"}
                            />
                        }
                        label={"Has path"}
                    />
                </FormControl>
                <FormControl fullWidth={true} style={styles}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={is_internal}
                                onChange={(obj) => onChangeHandler(obj)}
                                id={"is_internal"}
                            />
                        }
                        label={"Internal Navbar"}
                    />
                </FormControl>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                    style={{ marginLeft: "10px" }}
                    variant="contained"
                    color="primary"
                    onClick={submitHandler}
                >
                    Submit
                </Button>
            </div>
        </React.Fragment>
    );

    return component;
}
