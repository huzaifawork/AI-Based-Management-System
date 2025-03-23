import React, { useState } from "react";
import "./navbar.css";

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);

  return (
    <header className="navbar">
      <div style={{marginLeft:"10px"}} className="logo">
        <img style={{height:"45px" ,width:"45px" }}  src=".\images\logo.webp"/>
        <a style={{textDecoration:"none",marginTop:"10px"}} href="#">HRMS</a>
      </div>
      <nav  className={isMobile ? "nav-links mobile" : "nav-links"}>
        <ul style={{marginRight:"51px" ,marginTop:"10px"}} >
          <li>
            <a style={{textDecoration:"none"}} href="#home">Home</a>
          </li>
          <li>
            <a style={{textDecoration:"none"}} href="#features">Features</a>
          </li>
          <li>
            <a style={{textDecoration:"none"}} href="#contact">Contact Us</a>
          </li>
          <li>
            <a style={{textDecoration:"none"}} href="#contact">Login</a>
          </li>
        </ul>
      </nav>
      <button
        className="mobile-menu-icon"
        onClick={() => setIsMobile(!isMobile)}
      >
        {isMobile ? "✖" : "☰"}
      </button>
    </header>
  );
};

export default Navbar;
