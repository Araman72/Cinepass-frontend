import React from 'react'
import './Home.css'
import { Link } from 'react-router-dom';

function Experience() {
  return (
    <div>

 {/* ================= NAVBAR ================= */}
      <header className="navbar">
        <div className="nav-container">
          <div className="nav-left">
            <a href="#" className="brand-logo">
              Cine<span>Pass</span>
            </a>
            <div className="city-selector">
              <i className="fa-solid fa-location-dot"></i>
              <span>Bangalore</span>
              <i className="fa-solid fa-chevron-down"></i>
            </div>
          </div>

          <div className="nav-search">
            <i className="fa-solid fa-magnifying-glass search-icon"></i>
            <input type="text" placeholder="Search Movies, Theatres, Formats (e.g. IMAX, 4DX)..." />
            <span className="search-kbd">⌘K</span>
          </div>

          <nav className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About Us</Link>
            <Link to="/experience" className="nav-link">Experiences</Link>
            <Link to="/contact" className="nav-link">Contact us</Link>
            <Link to="/sports" className="nav-link">Sports</Link>
            <Link to="/offers" className="nav-link">Offers</Link>
          </nav>

          <div className="nav-actions">
            <button className="icon-btn" aria-label="Notifications">
              <i className="fa-regular fa-bell"></i>
              <span className="badge-dot"></span>
            </button>

          
          </div>
        </div>
      </header>

      <h2 className="section-title">Experience real time view</h2>

<div className="movies-grid">

    <article className="movie-card ex">
              <div className="card-thumb">
                <img src="/public/theater.jpg" alt="Toxic" />
                <div className="rating-badge">
                  <i className="fa-solid fa-star"></i> 6.8/10
                </div>
                <div className="tech-badge red">MAX</div>
              </div>
              <div className="card-body">
                <span className="movie-genre">experience the real intraction</span>
                <h3 className="movie-title">Step into the golden age of theater.</h3>
                <p className="movie-specs">English, Hindi </p>
                <div className="card-footer">
                 <Link to="/theater" className="nav-link"> Visit to experience real view</Link>
                 
                </div>
              </div>
            </article>



              <article className="movie-card ex">
              <div className="card-thumb">
                <img src="/public/space_img.jpg" alt="Toxic" />
                <div className="rating-badge">
                  <i className="fa-solid fa-star"></i> 6.8/10
                </div>
                <div className="tech-badge red">MAX</div>
              </div>
              <div className="card-body">
                <span className="movie-genre">UNMATCHED CLARITY</span>
                <h3 className="movie-title">IMAX Laser 4K</h3>
                <p className="movie-specs">Next-gen 4K laser projection with a new optical engin</p>
                <div className="card-footer">
                     <Link to="/theater2" className="nav-link"> Visit to experience real view</Link>
                 
                 
                </div>
              </div>
            </article> 

</div>

      
    </div>
  )
}

export default Experience