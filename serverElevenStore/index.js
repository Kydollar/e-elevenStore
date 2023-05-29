import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
import FileUpload from "express-fileupload";
import UserRoute from "./app/routes/UserRoute.js";
import AuthRoute from "./app/routes/AuthRoute.js";
import ProductsRoute from "./app/routes/ProductsRoute.js";
import RoleCategory from "./app/routes/Categories/RoleCategory.js";
import ProductCategory from "./app/routes/Categories/ProductCategory.js";
import CartRoute from "./app/routes/CartRoute.js";
import AddressRoute from "./app/routes/AddressRoute.js";
import TransactionRoute from "./app/routes/TransactionRoute.js";
import PaymentMethodRoute from "./app/routes/PaymentMethodRoute.js";
import ProofOfPaymentRoute from "./app/routes/ProofOfPaymentRoute.js";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const apiRoute = "/es-api";

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
	db: db,
});

// (async () => {
// 	await db.sync({ force: false, alter: true });
// })();

app.use(
	session({
		secret: process.env.SESS_SECRET,
		resave: false,
		saveUninitialized: true,
		store: store,
		cookie: {
			secure: "auto",
		},
	})
);

app.use(
	cors({
		credentials: true,
		origin: ["http://localhost:3000", "http://localhost:3001"],
	})
);

app.use(express.json());
app.use(FileUpload());
app.use(express.static("public"));
app.use(apiRoute, UserRoute);
app.use(apiRoute, ProductsRoute);
app.use(apiRoute, CartRoute);
app.use(apiRoute, TransactionRoute);
app.use(apiRoute, AuthRoute);
app.use(apiRoute, PaymentMethodRoute);
app.use(apiRoute, ProofOfPaymentRoute);
app.use(apiRoute, RoleCategory);
app.use(apiRoute, ProductCategory);
app.use(apiRoute, AddressRoute);

app.use(
	"/api",
	createProxyMiddleware({
		target: "https://api.rajaongkir.com",
		changeOrigin: true,
		headers: {
			"Content-Type": "application/json",
			"key": "a3d20f99ea0ac3cdc859eb7fabae576d", // Ganti dengan API key RajaOngkir Anda
		},
	})
);

// store.sync();

app.listen(port, () => {
	console.log(`Server telah dijalankan... = http://localhost:${port}${apiRoute}`);
});
