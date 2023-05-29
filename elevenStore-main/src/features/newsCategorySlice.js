import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// action
export const fetchNewsCategory = createAsyncThunk("fetchNewsCategory", async () => {
	const response = await fetch(`${process.env.REACT_APP_MY_API}/news-categories`);
	return response.json();
});

const newsCategorySlice = createSlice({
	name: "newsCategory",
	initialState: {
		isLoading: false,
		isError: false,
		data: null,
	},
	extraReducers: (builder) => {
		builder.addCase(fetchNewsCategory.pending, (state, action) => {
			state.isLoading = true;
		});
		builder.addCase(fetchNewsCategory.fulfilled, (state, action) => {
			state.isLoading = false;
			state.data = action.payload;
		});
		builder.addCase(fetchNewsCategory.rejected, (state, action) => {
			console.log("Error", action.payload);
			state.isError = true;
		});
	},
});

export default newsCategorySlice.reducer;