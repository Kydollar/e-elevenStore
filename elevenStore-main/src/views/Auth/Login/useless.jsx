import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Envelope, Password, SignIn } from "phosphor-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoginUser, reset, getMe } from "../../../features/authSlice";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { user, isError, isSuccess, isLoading, message } = useSelector((state) => state.auth);

	useEffect(() => {
		if (user || isSuccess) {
			navigate("/");
		}
		dispatch(reset());
		console.table("user", user, isSuccess, isError, isLoading)
	}, [user, isSuccess, dispatch, navigate]);

	const Auth = (e) => {
		e.preventDefault();
		dispatch(LoginUser({ email, password }));
	};
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
			<div className=" flex flex-col bg-white shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-3xl w-50 max-w-md">
				<div className="font-medium self-center text-xl sm:text-3xl text-gray-800">Login</div>
				<div className="mt-4 self-center text-center text-xl sm:text-sm text-gray-800">
					Selamat datang, silahkan login untuk mendapatkan akses 
				</div>
				

				<div className="mt-10">
					<form onSubmit={Auth}>
						{isError && <p className="has-text-centered">{message}</p>}
						<div className="flex flex-col mb-5">
							<label htmlFor="email" className="mb-1 text-xs tracking-wide text-gray-600">
								Email:
							</label>
							<div className="relative">
								<div className=" inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
									<Envelope size={24} alt="Email" />
								</div>

								<input
									id="email"
									type="email"
									name="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-2xl border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
									placeholder="Masukkan email anda"
								/>
							</div>
						</div>
						<div className="flex flex-col mb-6">
							<label
								htmlFor="password"
								className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"
							>
								Password:
							</label>
							<div className="relative">
								<div className=" inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
									<span>
										<Password size={24} alt="Password" />
									</span>
								</div>

								<input
									id="password"
									type="password"
									name="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-2xl border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400"
									placeholder="Masukkan password anda"
								/>
							</div>
						</div>

						<div className="flex w-full">
							<button
								type="submit"
								className="flex mt-2 items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-blue-500 hover:bg-blue-600 rounded-2xl py-2 w-full transition duration-150 ease-in"
							>
								<span className="mr-2 uppercase">{isLoading ? "Loading..." : "Login"}</span>
								<span>
									<SignIn size={24} alt="Password" />
								</span>
							</button>
						</div>
					</form>
				</div>
			</div>
			<div className="flex justify-center items-center mt-6">
				<span className="inline-flex items-center text-gray-700 font-medium text-xs text-center">
					<span className="ml-2">
						You don't have an account?
						<Link to="/" className="text-xs ml-2 text-blue-500 font-semibold">
							Register now
						</Link>
					</span>
				</span>
			</div>
		</div>
	);
}
