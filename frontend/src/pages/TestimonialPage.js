import React from "react";
import { testimonial } from "../components/data/Data";
import Slider from "react-slick";
import { FiChevronLeft, FiChevronRight, FiStar } from "react-icons/fi";
import Heading from "../components/common/Heading";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Testimonial.css";

export default function Testimonial() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          arrows: false
        }
      }
    ]
  };

  const NextArrow = ({ onClick }) => (
    <button className="slick-arrow next" onClick={onClick} aria-label="Next testimonial">
      <FiChevronRight />
    </button>
  );

  const PrevArrow = ({ onClick }) => (
    <button className="slick-arrow prev" onClick={onClick} aria-label="Previous testimonial">
      <FiChevronLeft />
    </button>
  );

  return (
    <section className="testimonial-section">
      <Heading heading="Client Voices" title="Testimonials" subtitle="Hear From Our Guests" />
      
      <div className="container">
        <div className="testimonial-carousel">
          <Slider {...settings}>
            {testimonial.map((item, index) => (
              <div key={index} className="testimonial-card">
                <div className="card-content">
                  <div className="testimonial-bg-accent"></div>
                  <div className="quote-icon">{item.icon}</div>
                  <p className="testimonial-text">{item.description}</p>
                  <div className="client-info">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="client-avatar"
                      loading="lazy"
                    />
                    <div className="client-details">
                      <h4 className="client-name">{item.name}</h4>
                      <p className="client-role">{item.profession}</p>
                      <div className="client-rating">
                        {[...Array(5)].map((_, i) => (
                          <FiStar key={i} className="star-icon" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
}