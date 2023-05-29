import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import roleReducer from "../features/roleSlice";

export const store = configureStore({
	reducer: {
		auth: authReducer,
		roleCategories: roleReducer,
	},
});
