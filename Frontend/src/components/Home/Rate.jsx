import React from "react";
import img from "../../assets/bg1.svg"; // Ensure this path is correct
import img1 from "../../assets/a7.svg"
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

// Updated reviews array with image paths
const reviews = [
  {
    text: "This product is fantastic! It has completely transformed my daily routine. I can't imagine going back to life before it!",
    rating: "★★★★★",
    name: "John Doe",
    image: "../../assets/users/user1.jpg", // Update with correct image path
  },
  {
    text: "Good quality and value for money. The performance has exceeded my expectations, making it a great buy for anyone looking for reliability!",
    rating: "★★★★☆",
    name: "Jane Smith",
    image: "../../assets/users/user2.jpg", // Update with correct image path
  },
  {
    text: "Absolutely love this product! It delivers on its promises and has been a game changer for me. Highly recommend to all my friends!",
    rating: "★★★★★",
    name: "Alice Johnson",
    image: "../../assets/users/user3.jpg", // Update with correct image path
  },
  {
    text: "Amazing experience! The customer service was top-notch, and the product itself is simply wonderful. I'll definitely be purchasing more in the future!",
    rating: "★★★★★",
    name: "Michael Brown",
    image: "../../assets/users/user4.jpg", // Update with correct image path
  },
  {
    text: "It's a solid product with a great design and usability. I've noticed significant improvements in my day-to-day tasks since I started using it!",
    rating: "★★★★☆",
    name: "Emily White",
    image: "../../assets/users/user5.jpg", // Update with correct image path
  },
];

const Rate = () => {
  return (
    <div className="relative font-poppins w-full h-screen sm:h-[35rem] flex justify-center items-center mx-auto">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${img})` }}
      >
        <div className="relative z-10 container max-w-screen-xl mx-auto h-full text-center p-6">
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
            What Our Users Say
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mb-8">
            Explore the heartfelt testimonials from satisfied peers. These
            glowing reviews reflect the positive impact our platform has had on
            their journeys. Join the community and experience success just like
            they did!
          </p>
        </div>
      </div>

      <div className="relative z-10 w-full mt-10 max-w-screen-lg mx-auto">
        <Swiper
          // Install Swiper modules
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={30}
          slidesPerView={1} // Adjust based on your needs
          navigation
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          loop // Optional: enables continuous loop mode
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index} className="text-center p-4">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <img
                  src={img1} // Ensure the path is correct
                  alt={review.name}
                  className="w-16 border border-black h-16 rounded-full mx-auto mb-4" // Style the image
                />
                <p className="text-lg text-gray-800 mb-4">"{review.text}"</p>
                <p className="text-xl font-bold text-yellow-500">{review.rating}</p>
                <p className="text-sm text-gray-600 mt-2">- {review.name}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Rate;
