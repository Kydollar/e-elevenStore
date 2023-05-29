import * as React from "react";
import { Link } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

import ModeEditRoundedIcon from "@mui/icons-material/ModeEditRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";

export default function DynamicTable(props) {
	const { columns, rows, handleDelete } = props;
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	return (
		<Paper sx={{ width: "100%", overflow: "hidden" }}>
			<TableContainer sx={{ maxHeight: 440 }}>
				<Table stickyHeader aria-label="sticky table">
					<TableHead>
						<TableRow>
							{columns.map((column) => (
								<TableCell
									key={column.id}
									align={column.align}
									style={{ minWidth: column.minWidth }}
								>
									{column.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
							return (
								<TableRow hover role="checkbox" tabIndex={-1} key={row.uuid}>
									{columns.map((column) => {
										const value = row[column.id];
										return (
											<TableCell key={column.id} align={column.align}>
												{column.format && typeof value === "number" ? column.format(value) : value}
												{column.id == "action" ? (
													<div className="flex item-center justify-center">
														<Link
															to={`${row.to}`}
															className="w-4 mx-1 transform hover:text-purple-500 hover:scale-110"
														>
															<ModeEditRoundedIcon alt="Edit User" />
														</Link>
														<Link
															onClick={() => handleDelete(row)}
															className="w-4 mx-1 transform hover:text-red-500 hover:scale-110"
														>
															<DeleteForeverRoundedIcon alt="Delete User" fontSize={"small"} />
														</Link>
													</div>
												) : null}
											</TableCell>
										); 
									})}
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[10, 25, 100]}
				component="div"
				count={rows.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</Paper>
	);
}
