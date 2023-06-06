import React, { useState } from "react";
import { TextField, CircularProgress } from "@mui/material";
import CustomButton from "components/Button";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";

const schema = yup.object().shape({
	email: yup
		.string()
		.email("Invalid email address")
		.required("Email is required")
		.test("unique-email", "Email not registered", async (value) => {
			try {
				const response = await axios.get(
					`${process.env.REACT_APP_MY_API}/users/check?email=${value}`
				);
				return response.data.exists;
			} catch (error) {
				// console.log(error);
			}
		}),
});

export default function SendEmail(props) {
	const { setActiveStep } = props;
	const [loading, setLoading] = useState(false); 
	const {
		handleSubmit,
		control,
		formState: { errors },
	} = useForm({
		mode: "all",
		resolver: yupResolver(schema),
	});

	const onSubmit = async (data) => {
		try {
			setLoading(true);

			await axios.post(`${process.env.REACT_APP_MY_API}/send-email`, {
				to: data.email,
			});

			Swal.fire({
				title: "Success",
				text: "OTP code was successfully sent via email! Please check your email",
				icon: "success",
				confirmButtonText: "Next",
			}).then(() => {
				// Set email in localStorage with expiration time
				const expirationTime = new Date().getTime() + 5 * 60 * 1000; // 3 minutes
				localStorage.setItem("otpExp", JSON.stringify({ expires: expirationTime }));
				setActiveStep(1); // Move to the next step
			});
		} catch (error) {
			console.error("Failed to send email", error);
			Swal.fire("Error", "Failed to send email", "error");
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Controller
				name="email"
				control={control}
				defaultValue=""
				render={({ field }) => (
					<TextField
						{...field}
						label="Registered Email"
						fullWidth
						margin="normal"
						required
						error={!!errors.email}
						helperText={errors.email?.message}
					/>
				)}
			/>
			<CustomButton
				type="submit"
				primary
				inputClassName="w-full justify-center mt-6 py-4"
				disabled={loading} // Disable the button when loading
			>
				{loading ? <CircularProgress size={24} /> : "Next"}
			</CustomButton>
		</form>
	);
}
