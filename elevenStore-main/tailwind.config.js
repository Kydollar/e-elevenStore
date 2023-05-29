/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: "#2563eb",
				primaryLight: "#dbeafe",
				primaryDark: "#1e3a8a",
				secondary: "#facc15",
				secondaryLight: "#fef9c3",
				secondaryDark: "#713f12",
				light: "#F2F2F2",
				dark: "#111827",
			},
		},
	},
};
