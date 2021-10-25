import React, { useState } from "react";
import {
	FormControl,
	Input,
	InputLabel,
	FormHelperText,
	Button,
	FormControlLabel,
	Checkbox,
} from "@material-ui/core/";
import AlertComponent from "../components/AlertComponent";
import { API } from "../constants/extras";
import DropDownForm from "../components/DropDownForm";

export default function NavigationForm(props) {
	const [dropdownForm, setDropDownForm] = useState(false);
	const [title, settitle] = useState("");
	const [priority, setPriority] = useState(1);
	const [is_path, setIsPath] = useState(false);
	const [is_internal, setIsInternal] = useState(false);
	const [zeroSubmission, setZeroSubmission] = useState(true);

	let titleError = false;
	let priorityError = false;
	let titleErrorText = "";
	let priorityErrorText = "";

	const styles = {
		margin: "10px",
		width: "300px",
	};

	const resetAll = () => {
		settitle("");
		setPriority(1);
		setIsPath(false);
		setIsInternal(false);
		setZeroSubmission(true);
	};

	const shuffleDropDownForm = () => {
		setDropDownForm((prevState) => !prevState);
	}

	const onChangeHandler = (object) => {
		var value = object.target.value;
		const obj = object.target.id;

		if (obj === "title") {
			settitle(value);
		} else if (obj === "priority") {
			setPriority(value);
		} else if (obj === "is_path") {
			value = object.target.checked;
			setIsPath(value);
		} else {
			value = object.target.checked;
			setIsInternal(value);
		}
	};

	const isCorrect = () => {
		if (title === "" || title.length < 3 || priority < 0) {
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
		if (priority < 0) {
			priorityError = true;
			priorityErrorText = "Priority can't be negative";
		}
	};

	const submitHandler = async (e) => {
		e.preventDefault();
		if (isCorrect()) {
			const requestOptions = {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${props.token}`
				},
				body: JSON.stringify({
					title,
					priority,
					is_internal,
					is_path,
				}),
			};
			const response = await fetch(`${API}/nav/add`, requestOptions);
			if (!response) {
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
						text="New navigation has been added successfully"
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
				<h2>Add Navigation</h2>
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
							shuffleDropDownForm();
						}}
					>
						{"Add a new dropdown tab"}
					</Button>
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
								id={"is_breaking_news"}
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

	if (dropdownForm) {
		console.log("yo");
		return <DropDownForm addAlert={props.addAlert} token={props.token} shuffleForm={shuffleDropDownForm} />;
	} else {
		console.log("go");
		return component;
	}
}
