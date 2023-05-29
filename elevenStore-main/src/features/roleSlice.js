import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// action
export const fetchRoles = createAsyncThunk("fetchRoles", async () => {
	const response = await fetch(`${process.env.REACT_APP_MY_API}/role`);
	return response.json();
});

const roleSlice = createSlice({
	name: "role",
	initialState: {
		isLoading: false,
		isError: false,
		data: null,
	},
	extraReducers: (builder) => {
		builder.addCase(fetchRoles.pending, (state, action) => {
			state.isLoading = true;
		});
		builder.addCase(fetchRoles.fulfilled, (state, action) => {
			state.isLoading = false;
			state.data = action.payload;
		});
		builder.addCase(fetchRoles.rejected, (state, action) => {
			console.log("Error", action.payload);
			state.isError = true;
		});
	},
});

export default roleSlice.reducer;