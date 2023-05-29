import React, { useState } from "react";

// Material UI
import { TextField, Select, MenuItem, Input } from "@mui/material";

// etc
import axios from "axios";
import Button from "components/Button";

// validate
const validate = (formState) => {
	const errors = {};
	if (!formState.username) {
		errors.username = "Username is required";
	}
	if (!formState.name) {
		errors.name = "Name is required";
	}
	if (!formState.email) {
		errors.email = "Email is required";
	}
	if (!formState.roleCategoryUuid) {
		errors.roleCategoryUuid = "Role is required";
	}
	if (!formState.file) {
		errors.file = "images must JPEG";
	}
	return errors;
};

export default function AddSecond() {
	const [formState, setFormState] = useState({
		username: "",
		name: "",
		email: "",
		password: "",
		confPassword: "",
		roleCategoryUuid: "",
	});
	const [formErrors, setFormErrors] = useState({});

	const handleInputChange = (e) => {
		setFormState({
			...formState,
			[e.target.name]: e.target.value,
		});
		setFormErrors(validate({ ...formState, [e.target.name]: e.target.value }));
	};

	const handleFileChange = (e) => {
		setFormState({
			...formState,
			avatar: e.target.files[0],
		});
		setFormErrors(validate({ ...formState, avatar: e.target.files[0] }));
	};
	const errors = validate(formState);

	const handleSubmit = async (e) => {
		e.preventDefault();
		// console.log(errors);
		try {
			await axios.post(`${process.env.REACT_APP_MY_API}/users`, {...formState}, {
				headers: {
					"Content-type": "multipart/form-data",
				},
			});
		} catch (error) {
			console.error(error);
		}
	};

	console.log(formState);
	return (
		<form onSubmit={handleSubmit}>
			<div>{errors.username}</div>
			<div className="flex md:flex-row flex-col-reverse gap-4 items-center justify-center">
				<div className="flex flex-col w-full gap-y-4 flex-grow">
					<TextField
						name="username"
						label="Username"
						placeholder="Username"
						value={formState.username}
						onChange={handleInputChange}
					/>
					<TextField
						name="name"
						label="Name"
						placeholder="Name"
						value={formState.name}
						onChange={handleInputChange}
					/>
					<TextField
						name="email"
						label="Email"
						placeholder="Email"
						value={formState.email}
						onChange={handleInputChange}
					/>
					<TextField
						name="roleCategoryUuid"
						select
						label="Role"
						value={formState.roleCategoryUuid}
						onChange={handleInputChange}
					>
						<MenuItem value="test">TEST</MenuItem>
					</TextField>
					<TextField
						name="password"
						label="Password"
						placeholder="Password"
						value={formState.password}
						onChange={handleInputChange}
					/>
					<TextField
						name="confPassword"
						label="ConfPassword"
						placeholder="ConfPassword"
						value={formState.confPassword}
						onChange={handleInputChange}
					/>
					<Input type="file" name="avatar" onChange={handleFileChange} />
					<Button
						type="submit"
						inputClassName="bg-gradient-to-br from-sky-700 to-sky-500 text-white hover:scale-105 hover:translate-x-0.5 transition-all"
					>
						Simpan
					</Button>
				</div>
				<div>AVATAR</div>
			</div>
		</form>
	);
}
