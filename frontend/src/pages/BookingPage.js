import React from "react";
import Heading from "../components/common/Heading";

const Booking = () => {
  return (
    <div className="booking-container theme-bg-gradient text-light py-5">
      {/* Page Heading */}
      <Heading heading="Book Your Experience" title="Home" subtitle="Booking" />

      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="booking-form p-4 rounded shadow-lg bg-dark">
              <h4 className="text-accent text-center mb-4">Reserve Your Stay</h4>

              {/* Booking Form */}
              <form>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-control theme-input" placeholder="Enter your name" />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email Address</label>
                    <input type="email" className="form-control theme-input" placeholder="Enter your email" />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Check-in Date</label>
                    <input type="date" className="form-control theme-input" />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Check-out Date</label>
                    <input type="date" className="form-control theme-input" />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Guests</label>
                    <select className="form-select theme-input">
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4+ Guests</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Room Type</label>
                    <select className="form-select theme-input">
                      <option value="standard">Standard Room</option>
                      <option value="deluxe">Deluxe Room</option>
                      <option value="suite">Luxury Suite</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Special Requests</label>
                  <textarea className="form-control theme-input" rows="3" placeholder="Any special requests?"></textarea>
                </div>

                <div className="text-center">
                  <button type="submit" className="btn theme-button px-4">Confirm Booking</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="text-center mt-5">
          <p className="text-light">
            <i className="bi bi-telephone-fill text-accent me-2"></i> Need help? Call us: <strong>+1 234 567 890</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Booking;
