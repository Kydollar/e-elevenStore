import React from "react";
import { Tooltip } from "@mui/material";

export default function Button(props) {
	const {
		onClick,
		children,
		inputClassName,
		title,
		type,
		tooltipTitle,
		disabled,
		primary,
		secondary,
	} = props;
	return (
		<Tooltip title={tooltipTitle} arrow>
			<button
				title={title}
				type={type}
				disabled={disabled}
				className={[
					`px-5 py-2 text-sm inline-flex relative overflow-hidden font-medium rounded-md ${
						primary && "text-gray-100 bg-gradient-to-tr from-gray-700 to-blue-800/50"
					} ${secondary && "text-gray-600 bg-gray-100"} rounded-md shadow-inner group`,
					inputClassName,
				].join(" ")}
				onClick={onClick}
			>
				<span
					className={`absolute top-0 left-0 w-0 h-0 transition-all duration-200 border-t-2 border-gray-600 group-hover:w-full ease`}
				></span>
				<span
					className={`absolute bottom-0 right-0 w-0 h-0 transition-all duration-200 border-b-2 border-gray-600 group-hover:w-full ease`}
				></span>
				<span
					className={`absolute top-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease`}
				></span>
				<span
					className={`absolute bottom-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease`}
				></span>
				<span
					className={`absolute inset-0 w-full h-full duration-300 delay-300 opacity-0 group-hover:opacity-100 ${
						primary && "bg-gray-200"
					} ${secondary && "bg-gradient-to-tr from-gray-700 to-blue-800/50"}`}
				></span>
				<span
					className={`relative transition-colors duration-300 delay-200 ease ${
						primary && "group-hover:text-black"
					} ${secondary && "group-hover:text-white"}`}
				>
					{children}
				</span>
			</button>
		</Tooltip>
	);
}
