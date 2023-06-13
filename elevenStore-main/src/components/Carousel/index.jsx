import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";

export default function Carousel(props) {
	const { carouselData } = props;
	const navigate = useNavigate();
	return (
		<>
			<Swiper
				pagination={{
					dynamicBullets: true,
				}}
				loop={true}
				modules={[Pagination, Autoplay]}
				className="mySwiper rounded-xl shadow-lg"
				autoplay={{
					delay: 3000,
				}}
			>
				{carouselData?.map((c, idx) => (
					<SwiperSlide key={idx}>
						<Tooltip title={`Klik untuk melihat produk ${c.title}`}>
							<div
								onClick={() => navigate(c.path)}
								style={{
									backgroundImage: `url(${c.image})`,
									backgroundSize: "cover",
									backgroundRepeat: "no-repeat",
									backgroundPosition: "center",
									height: "60vh", // Adjust the height as per your requirements
								}}
								className="flex justify-center pt-10 items-start"
							></div>
						</Tooltip>
					</SwiperSlide>
				))}
			</Swiper>
		</>
	);
}
