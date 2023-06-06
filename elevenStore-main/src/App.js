import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./views/Auth/Login";
import Register from "./views/Auth/Register";
import ForgotPassword from "./views/Auth/ForgotPassword";
import Dashboard from "./views/Dashboard";
import Products from "views/Products";
import Layout from "components/Layout";
import ProtectedRoute from "routes/ProtectedRoute";

// Admin
import AdminUsers from "./views/Admin/Users";
import AdminAddUser from "./views/Admin/Users/Add";
import AdminEditUser from "./views/Admin/Users/Edit";
import AdminProducts from "./views/Admin/Products";
import AdminAddProduct from "./views/Admin/Products/Add";
import AdminEditProduct from "./views/Admin/Products/Edit";
import AdminPaymentMethod from "./views/Admin/PaymentMethod";
import AdminAddPaymentMethod from "./views/Admin/PaymentMethod/Add";
import AdminEditPaymentMethod from "./views/Admin/PaymentMethod/Edit";
import AdminProductCategories from "./views/Admin/ProductCategories";
import AdminAddProductCategories from "./views/Admin/ProductCategories/Add";
import AdminEditProductCategories from "./views/Admin/ProductCategories/Edit";
import AdminTransactions from "./views/Admin/Transactions/second";

// User
import Account from "views/User";
import Profile from "views/User/Profile";
import Address from "views/User/Address";
import AddressAdd from "views/User/Address/Add";
import EditAddress from "views/User/Address/Edit";
import DetailProducts from "views/Products/DetailProducts";
import Categories from "views/Products/Categories";
import Cart from "views/Products/Cart";
import Checkout from "views/Products/Checkout";
import BillingHistory from "views/BillingHistory";
import Invoice from "views/Invoice";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<Dashboard />} />
					<Route
						path="/user/account"
						element={
							<ProtectedRoute>
								<Account />
							</ProtectedRoute>
						}
					>
						<Route path="profile" element={<Profile />} />
						<Route path="address" element={<Address />} />
						<Route path="address/add-address" element={<AddressAdd />} />
						<Route path="address/:addressId" element={<EditAddress />} />
					</Route>
					<Route path="/products" element={<Products />} />
					<Route path="/products/:category" element={<Categories />} />
					<Route path="/products/:category/:id" element={<DetailProducts />} />
					<Route
						path="/cart"
						element={
							<ProtectedRoute role="user">
								<Cart />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/checkout"
						element={
							<ProtectedRoute role="user">
								<Checkout />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/billing-history"
						element={
							<ProtectedRoute role="user">
								<BillingHistory />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/invoice"
						element={
							<ProtectedRoute>
								<Invoice />
							</ProtectedRoute>
						}
					/>

					{/* ADMIN */}
					<Route
						path="/admin/users"
						element={
							<ProtectedRoute role={"admin"}>
								<AdminUsers />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/admin/users/add"
						element={
							<ProtectedRoute role={"admin"}>
								<AdminAddUser />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/admin/users/edit/:uuid"
						element={
							<ProtectedRoute role={"admin"}>
								<AdminEditUser />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/admin/products"
						element={
							<ProtectedRoute role={"admin"}>
								<AdminProducts />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/admin/products/add"
						element={
							<ProtectedRoute role={"admin"}>
								<AdminAddProduct />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/admin/products/:uuid"
						element={
							<ProtectedRoute role={"admin"}>
								<AdminEditProduct />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/admin/payment-method"
						element={
							<ProtectedRoute role={"admin"}>
								<AdminPaymentMethod />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/admin/payment-method/add"
						element={
							<ProtectedRoute role={"admin"}>
								<AdminAddPaymentMethod />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/admin/payment-method/:uuid"
						element={
							<ProtectedRoute role={"admin"}>
								<AdminEditPaymentMethod />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/admin/product-categories"
						element={
							<ProtectedRoute role={"admin"}>
								<AdminProductCategories />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/admin/product-categories/add"
						element={
							<ProtectedRoute role={"admin"}>
								<AdminAddProductCategories />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/admin/product-categories/:uuid"
						element={
							<ProtectedRoute role={"admin"}>
								<AdminEditProductCategories />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/admin/transactions"
						element={
							<ProtectedRoute role={"admin"}>
								<AdminTransactions />
							</ProtectedRoute>
						}
					/>
				</Route>
				<Route path="/login" element={<Login />} />
				<Route path="/forgot-password" element={<ForgotPassword />} />
				<Route path="/register" element={<Register />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
