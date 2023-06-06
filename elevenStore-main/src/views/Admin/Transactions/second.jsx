import React, { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Divider } from "@mui/material";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import CustomModal from "components/Modal";

import PaidImage from "../../../assets/images/paid.webp";
import RejectedImage from "../../../assets/images/rejected.jpg";
import PendingImage from "../../../assets/images/pending.jpg";

import Swal from "sweetalert2";
import moment from "moment";
import "moment/locale/id";
import { formatPhoneNumber, formatter } from "utils/useFormatter";

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
		name: "createdAt",
		label: "Transaction Date",
		options: {
			filter: false,
			sort: false,
		},
	},
	{
		name: "invoice",
		label: "Invoice",
		options: {
			filter: false,
			sort: false,
			customBodyRender: (value) => {
				const invoice = value[0].invoice;
				return (
					<button
						className="underline hover:text-blue-500 whitespace-nowrap"
						autoFocus={false}
						onClick={() => value[1](value[0])}
					>
						{"#"}
						{invoice}
					</button>
				);
			},
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
					<>
						{value === null ? (
							<span className="bg-gradient-to-tl from-yellow-600 to-amber-400 px-2.5 text-xs rounded-lg py-1.5 inline-block whitespace-nowrap text-center align-baseline font-bold uppercase leading-none text-white">
								Pending
							</span>
						) : value === false ? (
							<div className="bg-gradient-to-tl from-red-600 to-rose-400 px-2.5 text-xs rounded-lg py-1.5 inline-block whitespace-nowrap text-center align-baseline font-bold uppercase leading-none text-white">
								Rejected
							</div>
						) : (
							<div className="bg-gradient-to-tl from-green-600 to-lime-400 px-2.5 text-xs rounded-lg py-1.5 inline-block whitespace-nowrap text-center align-baseline font-bold uppercase leading-none text-white">
								Paid
							</div>
						)}
					</>
				);
			},
		},
	},
];

export default function Transactions() {
	const [transactions, setTransactions] = useState([]);
	const [openProofOfPaymentModal, setOpenProofOfPaymentModal] = useState(false);
	const [selectedProofOfPayment, setSelectedProofOfPayment] = useState("");
	const [openInvoiceModal, setOpenInvoiceModal] = useState(false);
	const [selectedInvoice, setSelectedInvoice] = useState("");

	const options = {
		selectableRowsHeader: false,
		selectableRows: "single",
		responsive: "standard",
		customToolbarSelect: (selectedRows, displayData) => {
			const invoice = displayData[selectedRows.data[0].index].data[2].props.children[1];
			return (
				<div className="flex gap-2 mr-6">
					<button
						className="bg-gradient-to-tl from-red-600 to-rose-400 hover:to-red-600 hover:from-rose-400 hover:opacity-50 px-2.5 text-xs rounded-lg py-1.5 inline-block whitespace-nowrap text-center align-baseline font-bold uppercase leading-none text-white"
						onClick={() => handleStatusReject(invoice)}
					>
						Reject
					</button>
					<button
						className="bg-gradient-to-tl from-green-600 to-lime-400 hover:to-green-600 hover:from-lime-400 hover:opacity-50 px-2.5 text-xs rounded-lg py-1.5 inline-block whitespace-nowrap text-center align-baseline font-bold uppercase leading-none text-white"
						onClick={() => handleStatusApprove(invoice)}
					>
						Approve
					</button>
				</div>
			);
		},
	};

	const handleEscKey = (event) => {
		if (event.key === "Escape") {
			handleProofOfPaymentClose();
			handleInvoiceClose();
		}
	};

	useEffect(() => {
		getTransactions();

		document.addEventListener("keydown", handleEscKey);

		return () => {
			document.removeEventListener("keydown", handleEscKey);
		};
	}, []);

	const getTransactions = async () => {
		const response = await axios.get(`${process.env.REACT_APP_MY_API}/checkout`);
		const data = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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

	// Proof Of Payment
	const handleProofOfPaymentClick = (proofOfPayment) => {
		setSelectedProofOfPayment(proofOfPayment);
		setOpenProofOfPaymentModal(true);
	};

	const handleProofOfPaymentClose = () => {
		setOpenProofOfPaymentModal(false);
		setSelectedProofOfPayment("");
	};

	// Invoice
	const handleInvoiceClick = (invoice) => {
		setSelectedInvoice(invoice);
		setOpenInvoiceModal(true);
	};

	const handleInvoiceClose = () => {
		setOpenInvoiceModal(false);
		setSelectedInvoice("");
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
				<ThemeProvider theme={getMuiTheme()}>
					<MUIDataTable
						title={"List of Transactions"}
						data={transactions.map((e) => ({
							uuid: e.uuid,
							createdAt: moment(e.createdAt).format("LLLL"),
							invoice: [e, handleInvoiceClick],
							name: e.user.name,
							product: e.cart
								.flatMap((c) => c.product)
								.map((p) => p.nameProduct)
								.join(", "),
							paid:
								e.cart.flatMap((c) => c.subtotal).reduce((acc, curr) => acc + curr, 0) +
								e.shippingCost,
							proofOfPayment: [e?.proof_of_payment, handleProofOfPaymentClick],
							status: e?.status,
						}))}
						columns={columns}
						options={options}
					/>
				</ThemeProvider>
			</div>

			{/* Modal for proof of payment */}
			{selectedProofOfPayment && (
				<CustomModal open={openProofOfPaymentModal} handleClose={handleProofOfPaymentClose}>
					{selectedProofOfPayment.fileUrl &&
						(selectedProofOfPayment.fileUrl.toLowerCase().endsWith(".pdf") ? null : (
							<div className="relative w-[98vw] h-[98vh] overflow-auto bg-blue-900/10 shadow-lg border border-white/50 rounded-lg p-4 backdrop-blur-sm">
								<div className="sticky top-0 right-0 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg mb-2">
									<div className="px-4 py-2 flex justify-between items-center">
										<span className="inline-flex">
											<p className="font-bold">Proof Of Payment</p> :{" "}
											{selectedProofOfPayment.invoice}
										</span>
										<button
											onClick={handleProofOfPaymentClose}
											className="text-sm text-gray-400 cursor-pointer text-center self-center p-2 border rounded bg-gray-100/50"
										>
											ESC
										</button>
									</div>
								</div>
								<img
									src={selectedProofOfPayment.fileUrl}
									alt="Proof of Payment"
									style={{ width: "100%", height: "100%", objectFit: "contain" }}
								/>{" "}
							</div>
						))}
				</CustomModal>
			)}

			{/* Modal for invoice */}
			{selectedInvoice && (
				<CustomModal open={openInvoiceModal} handleClose={handleInvoiceClose}>
					<div className="relative w-[98vw] h-[98vh] overflow-auto bg-blue-900/10 shadow-lg border border-white/50 rounded-lg p-4 backdrop-blur-sm">
						<div className="sticky top-0 right-0 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg mb-2">
							<div className="px-4 py-2 flex justify-end">
								<button
									onClick={handleInvoiceClose}
									className="text-sm text-gray-400 cursor-pointer text-center self-center p-2 border rounded bg-gray-100/50"
								>
									ESC
								</button>
							</div>
						</div>
						<div className="flex flex-col gap-4 h-full">
							<div className="bg-white p-4 rounded-lg shadow-lg">
								<h1 className="mb-2 font-bold">Transaction Details</h1>
								<Divider />
								<div className="mt-2 flex gap-4 whitespace-nowrap">
									<span className="font-bold leading-7">
										<h2>Invoice</h2>
										<h2>Payment Method</h2>
										<h2>Purchase Date</h2>
										<h2>Transaction Status</h2>
									</span>
									<span className="leading-7">
										<p>
											{":"}&nbsp;{selectedInvoice.invoice}
										</p>
										<p>
											{":"}&nbsp;{selectedInvoice.payment_method.paymentName}
										</p>
										<p>
											{":"}&nbsp;{moment(selectedInvoice?.createdAt).format("LLLL")}
										</p>
										<p>
											{":"}&nbsp;
											{selectedInvoice.status === null ? (
												<span className="bg-gradient-to-tl from-yellow-600 to-amber-400 px-2.5 text-xs rounded-lg py-1.5 inline-block whitespace-nowrap text-center align-baseline font-bold uppercase leading-none text-white">
													Pending
												</span>
											) : selectedInvoice.status === false ? (
												<div className="bg-gradient-to-tl from-red-600 to-rose-400 px-2.5 text-xs rounded-lg py-1.5 inline-block whitespace-nowrap text-center align-baseline font-bold uppercase leading-none text-white">
													Rejected
												</div>
											) : (
												<div className="bg-gradient-to-tl from-green-600 to-lime-400 px-2.5 text-xs rounded-lg py-1.5 inline-block whitespace-nowrap text-center align-baseline font-bold uppercase leading-none text-white">
													Paid
												</div>
											)}
										</p>
									</span>
								</div>
							</div>
							<div className="bg-white p-4 rounded-lg shadow-lg">
								<h1 className="mb-2 font-bold">Account Details</h1>
								<Divider />
								<div className="mt-2 flex gap-4 whitespace-nowrap">
									<span className="font-bold leading-7">
										<h2>Name</h2>
										<h2>Email</h2>
									</span>
									<span className="leading-7">
										<p>
											{":"}&nbsp;{selectedInvoice.user.name}
										</p>
										<p>
											{":"}&nbsp;{selectedInvoice.user.email}
										</p>
									</span>
								</div>
							</div>
							<div className="bg-white p-4 rounded-lg shadow-lg">
								<h1 className="mb-2 font-bold">Shipping Information</h1>
								<Divider />
								<div className="mt-2 flex gap-4 whitespace-nowrap">
									<span className="font-bold leading-7">
										<h2>Recipient's Name</h2>
										<h2>Phone Number</h2>
										<h2>Courir</h2>
										<h2>Tracking ID</h2>
										<h2>Address</h2>
										{selectedInvoice.address.detailLainnya && <h2>Detailed/Benchmark Address</h2>}
									</span>
									<span className="leading-7">
										<p>
											{":"}&nbsp;{selectedInvoice.address.name}
										</p>
										<p>
											{":"}&nbsp;{formatPhoneNumber(selectedInvoice?.address?.phoneNumber)}
										</p>
										<p>
											{":"}&nbsp;{selectedInvoice.ekspedisi}
										</p>
										<p>
											{":"}&nbsp;{selectedInvoice.trackingId}
										</p>
										<p>
											{":"}&nbsp;{selectedInvoice.address.detailAddress}
										</p>
										{selectedInvoice.address.detailLainnya && (
											<p>
												{":"}&nbsp;{selectedInvoice.address.detailLainnya}
											</p>
										)}
									</span>
								</div>
							</div>
							<div className="bg-white p-4 rounded-lg shadow-lg">
								<div className="my-4 flex flex-row gap-12">
									<div>
										<h1 className="text-xl font-bold text-blue-500">INVOICE</h1>
										<p>
											{"#"}
											{selectedInvoice?.invoice}
										</p>
										<p>{moment(selectedInvoice?.createdAt).format("LLLL")}</p>
										<div className="mt-20">
											<h1 className="text-gray-400">Client Details</h1>
											<p>
												{selectedInvoice?.user?.name} / {selectedInvoice?.address?.name}
											</p>
											<p>{formatPhoneNumber(selectedInvoice?.address?.phoneNumber)}</p>
											<p>{selectedInvoice?.user?.email}</p>
											<p>{selectedInvoice?.address?.detailAddress}</p>
										</div>
									</div>
									<div className="grow flex justify-end">
										<div className="text-end">
											<h1 className="text-gray-400">Payment Method</h1>
											<p>
												{selectedInvoice?.payment_method.paymentName} (
												{selectedInvoice?.payment_method.name})
											</p>
											<p>No Rekening : {selectedInvoice?.payment_method.norek}</p>
											<div className="flex justify-end">
												<img
													src={
														selectedInvoice?.status === null
															? PendingImage
															: selectedInvoice.status === true
															? PaidImage
															: RejectedImage
													}
													alt="payment"
													className="h-32 w-32"
												/>
											</div>
										</div>
									</div>
								</div>
								<Divider className="pt-2" />
								<div className="flex justify-center mt-10">
									<table className="w-full text-left table-auto print:text-sm" id="table-items">
										<thead>
											<tr className="text-white bg-gray-700 print:bg-gray-300 print:text-black">
												<th className="px-4 py-2">Item</th>
												<th className="px-4 py-2 text-right">Qty</th>
												<th className="px-4 py-2 text-right">Unit Price</th>
												<th className="px-4 py-2 text-right">Subtotal</th>
											</tr>
										</thead>
										<tbody>
											{selectedInvoice?.cart.map((lc, idx) => (
												<tr key={idx}>
													<td className="px-4 py-2 border">{lc?.product.nameProduct}</td>
													<td className="px-4 py-2 text-right border tabular-nums slashed-zero">
														{lc?.quantity}
													</td>
													<td className="px-4 py-2 text-right border tabular-nums slashed-zero">
														{formatter.format(lc?.product.price)}
													</td>
													<td className="px-4 py-2 text-right border tabular-nums slashed-zero">
														{formatter.format(lc?.subtotal)}
													</td>
												</tr>
											))}
											<tr className="bg-gray-100">
												<td className="invisible"></td>
												<td className="invisible"></td>
												<td className="px-4 py-2 font-extrabold text-right border">Ongkir</td>
												<td className="px-4 py-2 text-right border tabular-nums slashed-zero">
													{formatter.format(selectedInvoice?.shippingCost)}
												</td>
											</tr>
											<tr className="bg-gray-100">
												<td className="invisible"></td>
												<td className="invisible"></td>
												<td className="px-4 py-2 font-extrabold text-right border">Total</td>
												<td className="px-4 py-2 text-right border tabular-nums slashed-zero">
													{formatter.format(
														selectedInvoice?.cart.reduce(
															(total, item) => total + item.subtotal,
															0
														) + selectedInvoice?.shippingCost
													)}
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</CustomModal>
			)}
		</>
	);
}
