import React from "react";
import { Modal, Fade } from "@mui/material";

const CustomModal = ({ open, handleClose, children, onTop }) => {
	return (
		<Modal
			open={open}
			onClose={handleClose}
			closeAfterTransition
			BackdropProps={{
				style: { backdropFilter: "blur(1.5px)", backgroundColor: "rgba(0,0,0,0.20)" },
			}}
		>
			<Fade in={open}>
				<div
					className={`absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
						onTop ? "md:top-26 top-16" : "top-1/2"
					}`}
				>
					{children}
				</div>
			</Fade>
		</Modal>
	);
};

export default CustomModal;
