import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import roleReducer from "../features/roleSlice";
import newsCategoryReducer from "../features/newsCategorySlice";

export const store = configureStore({
	reducer: {
		auth: authReducer,
		roleCategories: roleReducer,
		newsCategories: newsCategoryReducer,
	},
});
