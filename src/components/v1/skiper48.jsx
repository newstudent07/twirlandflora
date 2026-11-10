import React from "react";
import { motion } from "framer-motion";
import { Autoplay, EffectCards, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./skiper48.css";
import { cn } from "@/lib/utils";

const ChevronLeftIcon = ({ className = "h-5 w-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ChevronRightIcon = ({ className = "h-5 w-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

export const Carousel_002 = ({
  images = [],
  className = "",
  showPagination = true,
  showNavigation = true,
  loop = true,
  autoplay = true,
  spaceBetween = 40,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, translateY: 24, scale: 0.98 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: 0.2,
        ease: [0.25, 1, 0.5, 1],
      }}
      className={cn("Carousal_002_wrapper", className)}
    >
      <Swiper
        spaceBetween={spaceBetween}
        autoplay={
          autoplay
            ? {
                delay: 3500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }
            : false
        }
        effect="cards"
        grabCursor={true}
        loop={loop}
        pagination={
          showPagination
            ? {
                clickable: true,
              }
            : false
        }
        navigation={
          showNavigation
            ? {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }
            : false
        }
        className="Carousal_002"
        modules={[EffectCards, Autoplay, Pagination, Navigation]}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={image.src}
              alt={image.alt || `Slide ${index + 1}`}
              loading={index === 0 ? "eager" : "lazy"}
            />
          </SwiperSlide>
        ))}

        {showNavigation && (
          <div>
            <div className="swiper-button-prev" aria-label="Previous slide">
              <ChevronLeftIcon />
            </div>
            <div className="swiper-button-next" aria-label="Next slide">
              <ChevronRightIcon />
            </div>
          </div>
        )}
      </Swiper>
    </motion.div>
  );
};

export const Skiper48 = () => {
  const images = [
    {
      src: "/hero_floral.jpg",
      alt: "Voluminous Bright Florals",
    },
    {
      src: "/hero_floral_2.jpg",
      alt: "Blush Peonies & Ranunculus",
    },
    {
      src: "/hero_floral_3.jpg",
      alt: "Sunset Coral Botanical Arrangement",
    },
    {
      src: "/product1.jpg",
      alt: "The Peony Paradigm",
    },
    {
      src: "/product2.jpg",
      alt: "Midsummer Night",
    },
  ];

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden">
      <Carousel_002 images={images} loop autoplay showPagination showNavigation />
    </div>
  );
};

export default Carousel_002;
