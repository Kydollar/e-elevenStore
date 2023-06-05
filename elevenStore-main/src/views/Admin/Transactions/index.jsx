import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CustomButton from "components/Button";
import { Button } from "@mui/material";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import CustomModal from "components/Modal";
import { Popover, Typography } from "@mui/material";

import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";

import Swal from "sweetalert2";
import moment from "moment";
import "moment/locale/id";
import { formatter } from "utils/useFormatter";

moment.locale("id");

const columns = [
	{
		name: "uuid",
		label: "Uuid",
		options: {
			filter: false,
			sort: false,
			display: false,
			viewColumns: false,
		},
	},
	{
		name: "invoice",
		label: "Invoice",
		options: {
			filter: false,
			sort: false,
		},
	},
	{
		name: "name",
		label: "Customer Name",
		options: {
			filter: false,
			sort: false,
		},
	},
	{
		name: "product",
		label: "Product Item",
		options: {
			filter: false,
			sort: false,
			customBodyRender: (value) => {
				return <p className="font-semibold">{value}</p>;
			},
		},
	},
	{
		name: "paid",
		label: "Paid",
		options: {
			filter: false,
			sort: false,
			customBodyRender: (value) => {
				return <p className="font-semibold">{formatter.format(value)}</p>;
			},
		},
	},
	{
		name: "proofOfPayment",
		label: "Proof of Payment",
		options: {
			filter: false,
			sort: false,
			customBodyRender: (value) => {
				if (value[0]) {
					return (
						<button
							className="cursor-pointer bg-gradient-to-tl hover:to-blue-600 hover:from-indigo-400 hover:opacity-50 from-blue-600 to-indigo-400 px-2.5 text-xs rounded-lg py-2 inline-block whitespace-nowrap text-center align-baseline font-bold uppercase leading-none text-white"
							onClick={() => {
								if (value[0].fileUrl.toLowerCase().endsWith(".pdf")) {
									window.open(value[0].fileUrl, "_blank");
								} else {
									value[1](value[0]);
								}
							}}
						>
							View
						</button>
					);
				} else {
					return (
						<span className="cursor-default bg-gradient-to-tl from-gray-600 to-slate-400 px-2.5 text-xs rounded-lg py-2 inline-block whitespace-nowrap text-center align-baseline font-bold uppercase leading-none text-white">
							Not yet uploaded
						</span>
					);
				}
			},
		},
	},
	{
		name: "status",
		label: "Status",
		options: {
			filter: false,
			sort: false,
			customBodyRender: (value) => {
				return (
					<div className="flex flex-col gap-2 justify-center items-start">
						{value[0] === null ? (
							<>
								{/* <Button
									sx={{ fontSize: "0.75rem" }}
									variant="outlined"
									aria-label="changeStatus"
									startIcon={<ChangeCircleIcon fontSize="large" />}
									onClick={value[6]}
								>
									Change
								</Button> */}
								<button
									className="bg-gradient-to-tl from-red-600 to-rose-400 px-2.5 text-xs rounded-lg py-1.5 inline-block whitespace-nowrap text-center align-baseline font-bold uppercase leading-none text-white"
									onClick={() => value[2](value[1])}
								>
									Reject
								</button>
								<button
									className="bg-gradient-to-tl from-green-600 to-lime-400 px-2.5 text-xs rounded-lg py-1.5 inline-block whitespace-nowrap text-center align-baseline font-bold uppercase leading-none text-white"
									onClick={() => value[3](value[1])}
								>
									Approve
								</button>
							</>
						) : value[0] === false ? (
							<div className="bg-gradient-to-tl from-red-600 to-rose-400 px-2.5 text-xs rounded-lg py-1.5 inline-block whitespace-nowrap text-center align-baseline font-bold uppercase leading-none text-white">
								Rejected
							</div>
						) : (
							<div className="bg-gradient-to-tl from-green-600 to-lime-400 px-2.5 text-xs rounded-lg py-1.5 inline-block whitespace-nowrap text-center align-baseline font-bold uppercase leading-none text-white">
								Paid
							</div>
						)}
					</div>
				);
			},
		},
	},
];

export default function Transactions() {
	const [transactions, setTransactions] = useState([]);
	const [openProofOfPaymentModal, setOpenProofOfPaymentModal] = useState(false);
	const [selectedProofOfPayment, setSelectedProofOfPayment] = useState("");

	const options = {
		selectableRowsHeader: false,
		responsive: "standard",
		selectableRowsHideCheckboxes: true,
	};

	useEffect(() => {
		getTransactions();
	}, []);

	const getTransactions = async () => {
		const response = await axios.get(`${process.env.REACT_APP_MY_API}/checkout`);
		const data = response.data;
		setTransactions(
			Object.values(
				data.reduce((acc, primary) => {
					const { invoice } = primary;
					if (!acc[invoice]) {
						acc[invoice] = { ...primary, cart: [primary.cart] };
					} else {
						acc[invoice].cart.push(primary.cart);
					}
					return acc;
				}, {})
			)
		);
	};

	const handleProofOfPaymentClick = (proofOfPayment) => {
		setSelectedProofOfPayment(proofOfPayment);
		setOpenProofOfPaymentModal(true);
	};

	const handleProofOfPaymentClose = () => {
		setOpenProofOfPaymentModal(false);
	};

	const handleStatusReject = (value) => {
		updateStatusByInvoice(value, false); // Call the function to update status with value and status = false
	};
	
	const handleStatusApprove = (value) => {
		updateStatusByInvoice(value, true); // Call the function to update status with value and status = true
	};

	const updateStatusByInvoice = async (invoice, status) => {
		Swal.fire({
			title: "Confirmation",
			text: "Are you sure you want to change the status?",
			icon: "warning",
			showCancelButton: true,
			customClass: {
				confirmButton: "confirm",
				cancelButton: "cancel",
			},
			buttonsStyling: false,
			confirmButtonText: "Ya, sure!",
			dangerMode: true,
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					await axios.put(`${process.env.REACT_APP_MY_API}/checkout/${invoice}`, {
						status: status,
					});
					getTransactions();
					Swal.fire({
						title: "Status Updated",
						icon: "success",
						html: "The status has been <b>successfully</b> updated.",
						timer: 2000,
						timerProgressBar: true,
						showConfirmButton: false,
					});
				} catch (error) {
					Swal.fire("Error", `Status update failed: ${error.response.data.message}`, "error");
				}
			}
		});
	};

	const getMuiTheme = () =>
		createTheme({
			components: {
				MuiPaper: {
					styleOverrides: {
						root: {
							boxShadow: "0px 0px 5px 2px rgba(0,0,0,0.03)",
							borderRadius: "0.5rem",
						},
					},
				},
				MUIDataTableToolbarSelect: {
					styleOverrides: {
						root: {
							padding: "14px 0px 14px 0px",
						},
					},
				},
			},
		});

	return (
		<>
			<div className="relative w-full h-full">
				<div className="flex justify-end items-center mb-2">
					<Link to={"add"}>
						<CustomButton primary>
							<div className="inline-flex align-middle">
								<AddBusinessIcon alt="Add Transaction" fontSize={"small"} />
								<p className="ml-2 cursor-pointer">Add Transaction</p>
							</div>
						</CustomButton>
					</Link>
				</div>
				<ThemeProvider theme={getMuiTheme()}>
					<MUIDataTable
						title={"List of Transactions"}
						data={transactions.map((e) => ({
							uuid: e.uuid,
							invoice: e.invoice,
							name: e.user.name,
							product: e.cart
								.flatMap((c) => c.product)
								.map((p) => p.nameProduct)
								.join(", "),
							paid:
								e.cart.flatMap((c) => c.subtotal).reduce((acc, curr) => acc + curr, 0) +
								e.shippingCost,
							proofOfPayment: [e?.proof_of_payment, handleProofOfPaymentClick],
							status: [
								e?.status,
								e?.invoice,
								handleStatusReject,
								handleStatusApprove,
							],
						}))}
						columns={columns}
						options={options}
					/>
				</ThemeProvider>
			</div>
			{/* Modal for proof of payment */}
			<CustomModal open={openProofOfPaymentModal} handleClose={handleProofOfPaymentClose}>
				{selectedProofOfPayment &&
					selectedProofOfPayment.fileUrl &&
					(selectedProofOfPayment.fileUrl.toLowerCase().endsWith(".pdf") ? null : (
						<div className="relative">
							<div className="absolute right-0 -top-10">
								<Button
									sx={{ color: "red", outlineColor: "red" }}
									aria-label="changeImage"
									startIcon={<HighlightOffIcon fontSize="large" />}
									onClick={handleProofOfPaymentClose}
								>
									Close
								</Button>
							</div>
							<img
								src={selectedProofOfPayment.fileUrl}
								alt="Proof of Payment"
								style={{ width: "100%", height: "100%", objectFit: "contain" }}
							/>{" "}
						</div>
					))}
			</CustomModal>
		</>
	);
}
