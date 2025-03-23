  import React from "react";
  import { testimonial } from "../data/Data";
  import Slider from "react-slick";
  import "slick-carousel/slick/slick.css";
  import "slick-carousel/slick/slick-theme.css";

  export default function Sliders() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 2,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      arrows: false,
    };

    return (
      <div className="container-xxl testimonial my-5 py-5 theme-bg">
        <div className="container">
          <div className="testimonial-carousel py-5">
            <Slider {...settings}>
              {testimonial.map((item, key) => (
                <div key={key} className="testimonial-item theme-card rounded overflow-hidden">
                  <p className="text-light">{item.description}</p>
                  <div className="d-flex align-items-center">
                    <img
                      className="img-fluid flex-shrink-0 rounded"
                      src={item.img}
                      style={{ width: "50px", height: "50px" }}
                      alt="testimonial"
                    />
                    <div className="ps-3">
                      <h6 className="fw-bold text-accent mb-1">{item.name}</h6>
                      <small className="text-light">{item.profession}</small>
                    </div>
                  </div>
                  <div className="testimonial-icon">{item.icon}</div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    );
  }
