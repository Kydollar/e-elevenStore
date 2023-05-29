import React from "react";

const Dashboard = () => {
	return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((d) => (
		<div key={d} className="relative w-full h-full px-4 py-4">
			DASHBOARD
		</div>
	));
};

export default Dashboard;
