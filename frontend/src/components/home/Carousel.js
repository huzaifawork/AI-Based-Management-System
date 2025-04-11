import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { carouselData } from "../data/Data";
import "./Carousel.css"; // Ensure this CSS file exists
import { FiArrowRight } from 'react-icons/fi';

export default function Carousel() {
  const sliderRef = useRef(null);
  const next = () => sliderRef.current?.slickNext();
  const previous = () => sliderRef.current?.slickPrev();

  // Modern slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    fade: true,
    cssEase: "cubic-bezier(0.645, 0.045, 0.355, 1)",
    responsive: [
      {
        breakpoint: 768,
        settings: {
          dots: false
        }
      }
    ]
  };

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") previous();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="carousel-container">
      <Slider ref={sliderRef} {...settings}>
        {carouselData.map((val, index) => (
          <div key={index} className="carousel-slide">
            <div className="image-wrapper">
              <img
                src={val.img}
                alt={val.title}
                className="carousel-image"
                loading="lazy"
              />
              <div className="gradient-overlay" />
            </div>

            <div className="carousel-content mt-5">
              <div className="carousel-caption">
                <h6 className="carousel-subtitle">{val.subtitle}</h6>
                <h1 className="carousel-title">{val.title}</h1>
                <div className="carousel-buttons">
                  <Link to="/rooms" className="carousel-btn primary">
                    {val.btn1} <FiArrowRight className="ms-2" />
                  </Link>
                  <Link to="/reserve-table" className="carousel-btn secondary">
                    {val.btn2}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
