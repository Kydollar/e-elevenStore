import React from "react";

const Dashboard = () => {
	return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((d) => (
		<div key={d} className="relative w-full h-full px-4 py-20">
			DASHBOARD
		</div>
	));
};

export default Dashboard;
