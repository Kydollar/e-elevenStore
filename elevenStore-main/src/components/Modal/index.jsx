import React from "react";
import { Modal, Fade } from "@mui/material";

const CustomModal = ({ open, handleClose, children }) => {
	return (
		<Modal
			open={open}
			onClose={handleClose}
			closeAfterTransition
		>
			<Fade in={open}>
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">{children}</div>
			</Fade>
		</Modal>
	);
};
export default CustomModal;
