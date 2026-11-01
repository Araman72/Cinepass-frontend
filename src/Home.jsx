import { useState, useEffect } from 'react';
import Swiper from 'swiper';
import gsap from 'gsap';
import { Autoplay, Pagination } from 'swiper/modules';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

// Swiper CSS
import 'swiper/css';
import 'swiper/css/pagination';
// stylesheet
import './Home.css';
gsap.registerPlugin(ScrollTrigger);

function Home({ currentUser, onNavigateLogin, onNavigateDashboard, onLogout }) {
  
  // Modal & Selection States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    title: 'Spider-Man: Brand New Day',
    format: 'IMAX 3D',
    time: '10:45 AM',
    price: 420,
  });
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Interactive Filters
  const [activeLang, setActiveLang] = useState('Hindi');
  const [activeFormat, setActiveFormat] = useState('');
  const [activeDate, setActiveDate] = useState('Today, 24 Sep');
  const [remindedMovies, setRemindedMovies] = useState({});

// ================= GSAP ANIMATIONS =================
  useEffect(() => {
    // gsap.context() ensures all animations/scroll-triggers are cleaned up on unmount
    let ctx = gsap.context(() => {
      
      const heroTL = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (document.querySelector(".navbar")) {
        heroTL.from(".navbar", {
          y: -50,
          opacity: 0,
          duration: 0.7,
          clearProps: "all"
        });
      }

      if (document.querySelector("#heroPoster")) {
        heroTL.from("#heroPoster", {
          scale: 0.88,
          opacity: 0,
          transformPerspective: 1000,
          rotationY: 15,
          duration: 0.9,
          clearProps: "opacity,scale" 
        }, "-=0.4");
      }

      if (document.querySelector(".hero-content")) {
        heroTL.from(".hero-content > *", {
          y: 20,
          opacity: 0,
          stagger: 0.08,
          duration: 0.6,
          clearProps: "all"
        }, "-=0.6");
      }

      if (document.querySelector(".filter-strip")) {
        heroTL.from(".filter-strip", {
          y: 15,
          opacity: 0,
          duration: 0.4,
          clearProps: "all"
        }, "-=0.2");
      }

      // Helper function to animate scroll sections safely
      const animateSection = (selector, triggerSelector, fromVars) => {
        const elements = document.querySelectorAll(selector);
        const trigger = document.querySelector(triggerSelector);
        if (!elements.length || !trigger) return;

        gsap.fromTo(elements, 
          { opacity: 0, ...fromVars },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: "power2.out",
            clearProps: "all", // Removes inline styles so CSS :hover still works!
            scrollTrigger: {
              trigger: trigger,
              start: "top 85%",
              toggleActions: "play none none none",
              once: true 
            }
          }
        );
      };

      // Apply Scroll Animations
      animateSection(".movie-card", ".movies-grid", { y: 40 });
      animateSection(".immersion-card", ".immersion-grid", { y: 50 });
      animateSection(".cinema-row", ".cinemas-list", { x: -30 });
      animateSection(".coming-card", ".coming-grid", { y: 35 });

    });

    // Cleanup function: destroys ScrollTriggers when leaving the page
    return () => ctx.revert();
  }, []);

  // ================= SWIPER INITIALIZATION =================
  useEffect(() => {
    const swiper = new Swiper('.swiper', {
      modules: [Autoplay, Pagination],
      direction: 'horizontal',
      loop: true,
      speed: 800,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      pagination: {
        el: '.swiper-pagination',
        dynamicBullets: true,
        clickable: true, 
      },
    });

    return () => {
      if (swiper && swiper.destroy) {
        swiper.destroy(true, true);
      }
    };
  }, []);

  // Central Booking Check: Only allow logged-in users to access booking
  const openBookingModal = (title, format = 'Standard', time = '10:45 AM', price = 300) => {
    if (!currentUser) {
      alert('Please sign in to your account to book movie tickets.');
      onNavigateLogin();
      return;
    }

    setModalData({ title, format, time, price });
    setSelectedSeats([]);
    setIsModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsModalOpen(false);
    setSelectedSeats([]);
  };

  const toggleRemind = (movieKey) => {
    setRemindedMovies((prev) => ({
      ...prev,
      [movieKey]: !prev[movieKey],
    }));
  };

  const seatRows = ['A', 'B', 'C', 'D'];
  const toggleSeat = (seatId) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]
    );
  };

  return (
    <div className="home-page-root">
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
            <Link to="/contact" className="nav-link">Contact Us</Link>
            <Link to="/sports" className="nav-link">Sports</Link>
            <Link to="/offers" className="nav-link">Offers</Link>
          </nav>

          <div className="nav-actions">
            <button className="icon-btn" aria-label="Notifications">
              <i className="fa-regular fa-bell"></i>
              <span className="badge-dot"></span>
            </button>

            {currentUser ? (
              <div className="user-profile-group">
                <div 
                  className="user-avatar" 
                  title={`Profile: ${currentUser.email}`}
                  onClick={onNavigateDashboard}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces" 
                    alt="Avatar" 
                  />
                </div>
                <button className="btn-nav-dashboard btn " onClick={onNavigateDashboard}>
                  Dashboard
                </button>
                <button className="btn-nav-logout btn" onClick={onLogout}>
                  Log Out
                </button>
              </div>
            ) : (
              <button className="btn-nav-login btn" onClick={onNavigateLogin}>
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ================= HERO SHOWCASE ================= */}
      <div className="swiper">
        <div className="swiper-wrapper">
          {/* SLIDE 1: SPIDER-MAN */}
          <section className="hero-section swiper-slide">
            <div className="hero-backdrop-spider"></div>
            <div className="hero-container">
              <div className="hero-poster-card" id="heroPoster">
                <img src="/public/spiderman.jpg" alt="Spider-Man" />
                <div className="poster-reflection"></div>
              </div>

              <div className="hero-content">
                <div className="hero-studio-row">
                  <span className="studio-badge">
                    <i className="fa-brands fa-redhat"></i> MARVEL STUDIOS
                  </span>
                  <div className="studio-logo-chip">
                    SV STUDIO <span>3V</span>
                  </div>
                </div>

                <h1 className="hero-title">Spider-Man: Brand New Day</h1>

                <div className="hero-badges">
                  <span className="format-tag">2D</span>
                  <span className="format-tag">3D</span>
                  <span className="format-tag">3D SCREEN X</span>
                  <span className="format-tag highlight">4DX</span>
                  <span className="format-tag">EPIQ 3D</span>
                  <span className="format-tag tag-more">+4</span>
                  <span className="lang-tag">English, Telugu, +4</span>
                </div>

                <div className="hero-meta">
                  <span><i className="fa-regular fa-clock"></i> 2h 25m</span>
                  <span>•</span>
                  <span>Action, Adventure, Sci-Fi</span>
                  <span>•</span>
                  <span className="censor-tag">UA13+</span>
                  <span>•</span>
                  <span>30 Jul, 2026</span>
                </div>

                <div className="hero-cta-group">
                  <button 
                    className="btn-primary btn"
                    onClick={() => openBookingModal('Spider-Man: Brand New Day', 'IMAX 3D', '10:45 AM', 420)}
                  >
                    <i className={currentUser ? "fa-solid fa-ticket" : "fa-solid fa-lock"}></i> 
                    {currentUser ? " Book Tickets" : " Sign In to Book"}
                  </button>
                  <a href="https://www.youtube.com/watch?v=QdLExXYsyQw" target="_blank" rel="noreferrer">
                    <button className="btn-secondary">
                      <i className="fa-solid fa-play"></i> Watch Trailer
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* SLIDE 2: MIRZAPUR */}
          <section className="hero-section swiper-slide">
            <div className="hero-backdrop-mirzapur"></div>
            <div className="hero-container">
              <div className="hero-poster-card">
                <img src="/public/mirzapur_movie.jpg" alt="Mirzapur" />
                <div className="poster-reflection"></div>
              </div>

              <div className="hero-content">
                <div className="hero-studio-row">
                  <span className="studio-badge">
                    <i className="fa-brands fa-redhat"></i> BOLLYWOOD
                  </span>
                  <div className="studio-logo-chip">
                    SV STUDIO <span>3V</span>
                  </div>
                </div>

                <h1 className="hero-title">MIRZAPUR : The movie</h1>

                <div className="hero-badges">
                  <span className="format-tag">2D</span>
                  <span className="format-tag">3D</span>
                  <span className="format-tag">3D SCREEN X</span>
                  <span className="format-tag highlight">4DX</span>
                  <span className="format-tag">EPIQ 3D</span>
                  <span className="format-tag tag-more">+4</span>
                  <span className="lang-tag">English, Telugu, +4</span>
                </div>

                <div className="hero-meta">
                  <span><i className="fa-regular fa-clock"></i> 2h 25m</span>
                  <span>•</span>
                  <span>Action, Adventure, Crime</span>
                  <span>•</span>
                  <span className="censor-tag">A</span>
                  <span>•</span>
                  <span>30 Jul, 2026</span>
                </div>

                <div className="hero-cta-group">
                  <button 
                    className="btn-primary btn"
                    onClick={() => openBookingModal('MIRZAPUR : The movie', '2D', '02:15 PM', 289)}
                  >
                    <i className={currentUser ? "fa-solid fa-ticket" : "fa-solid fa-lock"}></i> 
                    {currentUser ? " Book Tickets" : " Sign In to Book"}
                  </button>
                  <a href="https://www.youtube.com/watch?v=5vMWZhHPlaw" target="_blank" rel="noreferrer">
                    <button className="btn-secondary">
                      <i className="fa-solid fa-play"></i> Watch Trailer
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* SLIDE 3: TOXIC */}
          <section className="hero-section swiper-slide">
            <div className="hero-backdrop-toxic"></div>
            <div className="hero-container">
              <div className="hero-poster-card">
                <img src="/public/Toxic_movie.jpg" alt="Toxic" />
                <div className="poster-reflection"></div>
              </div>

              <div className="hero-content">
                <div className="hero-studio-row">
                  <span className="studio-badge">
                    <i className="fa-brands fa-redhat"></i> KVN PRODUCTION
                  </span>
                  <div className="studio-logo-chip">
                    SV STUDIO <span>3V</span>
                  </div>
                </div>

                <h1 className="hero-title">TOXIC : A Fairy Tale for Grownups</h1>

                <div className="hero-badges">
                  <span className="format-tag">2D</span>
                  <span className="format-tag">3D</span>
                  <span className="format-tag">3D SCREEN X</span>
                  <span className="format-tag highlight">4DX</span>
                  <span className="format-tag">EPIQ 3D</span>
                  <span className="format-tag tag-more">+4</span>
                  <span className="lang-tag">English, Telugu, +4</span>
                </div>

                <div className="hero-meta">
                  <span><i className="fa-regular fa-clock"></i> 3h 14m</span>
                  <span>•</span>
                  <span>Action, Drama, Thriller</span>
                  <span>•</span>
                  <span className="censor-tag">UA13+</span>
                  <span>•</span>
                  <span>26 Aug, 2026</span>
                </div>

                <div className="hero-cta-group">
                  <button 
                    className="btn-primary btn"
                    onClick={() => openBookingModal('TOXIC : A Fairy Tale for Grownups', 'MAX', '06:30 PM', 300)}
                  >
                    <i className={currentUser ? "fa-solid fa-ticket" : "fa-solid fa-lock"}></i> 
                    {currentUser ? " Book Tickets" : " Sign In to Book"}
                  </button>
                  <a href="https://www.youtube.com/watch?v=G5hWlD5zfhw" target="_blank" rel="noreferrer">
                    <button className="btn-secondary">
                      <i className="fa-solid fa-play"></i> Watch Trailer
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* SLIDE 4: DRISHYAM */}
          <section className="hero-section swiper-slide">
            <div className="hero-backdrop-drishyam"></div>
            <div className="hero-container">
              <div className="hero-poster-card">
                <img src="/public/drishyam.jpg" alt="Drishyam" />
                <div className="poster-reflection"></div>
              </div>

              <div className="hero-content">
                <div className="hero-studio-row">
                  <span className="studio-badge">
                    <i className="fa-brands fa-redhat"></i> BOLLYWOOD
                  </span>
                  <div className="studio-logo-chip">
                    SV STUDIO <span>3V</span>
                  </div>
                </div>

                <h1 className="hero-title">DRISHYAM : THE CONCLUSION</h1>

                <div className="hero-badges">
                  <span className="format-tag">2D</span>
                  <span className="format-tag">3D</span>
                  <span className="format-tag">3D SCREEN X</span>
                  <span className="format-tag highlight">4DX</span>
                  <span className="format-tag">EPIQ 3D</span>
                  <span className="format-tag tag-more">+4</span>
                  <span className="lang-tag">English, Telugu, +4</span>
                </div>

                <div className="hero-meta">
                  <span><i className="fa-regular fa-clock"></i> 2h 25m</span>
                  <span>•</span>
                  <span>Thriller, Suspense</span>
                  <span>•</span>
                  <span className="censor-tag">UA13+</span>
                  <span>•</span>
                  <span>30 Jul, 2026</span>
                </div>

                <div className="hero-cta-group">
                  <button 
                    className="btn-primary btn"
                    onClick={() => openBookingModal('DRISHYAM : THE CONCLUSION', 'IMAX 3D', '09:50 PM', 350)}
                  >
                    <i className={currentUser ?  "fa-solid fa-ticket btn " : "fa-solid fa-lock btn"}></i> 
                    {currentUser ? " Book Tickets" : " Sign In to Book"}
                  </button>
                  <a href="https://www.youtube.com/watch?v=BSZZwBaNQAA" target="_blank" rel="noreferrer">
                    <button className="btn-secondary">
                      <i className="fa-solid fa-play"></i> Watch Trailer
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className="swiper-pagination"></div>
      </div>

      {/* ================= FILTER PILLS ================= */}
      <div className="filter-strip">
        <div className="filter-container">
          <div className="filter-group">
            <span className="filter-label">LANGUAGES:</span>
            <div className="pill-list">
              {['Hindi', 'English', 'Telugu', 'Tamil', 'Malayalam'].map((lang) => (
                <button 
                  key={lang}
                  className={`pill ${activeLang === lang ? 'active' : ''}`}
                  onClick={() => setActiveLang(lang)}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <span className="filter-label">FORMAT:</span>
            <div className="pill-list">
              {['IMAX 3D', '4DX', 'Dolby Atmos', 'ICE'].map((fmt) => (
                <button 
                  key={fmt}
                  className={`pill ${activeFormat === fmt ? 'active' : ''}`}
                  onClick={() => setActiveFormat(activeFormat === fmt ? '' : fmt)}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="main-content">
        {/* ================= IN THEATRES NOW ================= */}
        <section className="section">
          <div className="section-header">
            <div>
              <span className="section-tag">IN THEATRES NOW</span>
              <h2 className="section-title">Now Showing in Bangalore</h2>
            </div>
            <a href="#" className="view-all-link">
              Explore All Movies <i className="fa-solid fa-arrow-right"></i>
            </a>
          </div>

          <div className="movies-grid">
            {/* Movie 1 */}
            <article className="movie-card">
              <div className="card-thumb">
                <img src="/public/Toxic_movie.jpg" alt="Toxic" />
                <div className="rating-badge">
                  <i className="fa-solid fa-star"></i> 6.8/10
                </div>
                <div className="tech-badge red">MAX</div>
              </div>
              <div className="card-body">
                <span className="movie-genre">Action/Crime/Psychological</span>
                <h3 className="movie-title">Toxic: A Fairy Tale for Grown-ups</h3>
                <p className="movie-specs">English, Hindi • 2h 35m</p>
                <div className="card-footer">
                  <span className="price-info">From <strong>₹300</strong></span>
                  <button 
                    className="btn-sm" 
                    onClick={() => openBookingModal('Toxic: A Fairy Tale for Grown-ups', 'MAX', '06:30 PM', 300)}
                  >
                    {currentUser ? 'Book Now' : 'Sign In to Book'}
                  </button>
                </div>
              </div>
            </article>

            {/* Movie 2 */}
            <article className="movie-card">
              <div className="card-thumb">
                <img src="/public/mirzapur_movie.jpg" alt="Mirzapur" />
                <div className="rating-badge">
                  <i className="fa-solid fa-star"></i> 8.4/10
                </div>
                <div className="tech-badge">UA</div>
              </div>
              <div className="card-body">
                <span className="movie-genre">Action/Crime/Thriller</span>
                <h3 className="movie-title">Mirzapur: The Movie</h3>
                <p className="movie-specs">Hindi • 2h 27m</p>
                <div className="card-footer">
                  <span className="price-info">From <strong>₹289</strong></span>
                  <button 
                    className="btn-sm" 
                    onClick={() => openBookingModal('Mirzapur: The Movie', '2D', '02:15 PM', 289)}
                  >
                    {currentUser ? 'Book Now' : 'Sign In to Book'}
                  </button>
                </div>
              </div>
            </article>

            {/* Movie 3 */}
            <article className="movie-card">
              <div className="card-thumb">
                <img src="/public/hanuman-ansh.webp" alt="Hanuman Ansh" />
                <div className="rating-badge">
                  <i className="fa-solid fa-star"></i> 9.0/10
                </div>
                <div className="tech-badge red">4DX</div>
              </div>
              <div className="card-body">
                <span className="movie-genre">Biography/Devotional/Drama</span>
                <h3 className="movie-title">Hanuman Ansh</h3>
                <p className="movie-specs">English • 1h 45m</p>
                <div className="card-footer">
                  <span className="price-info">From <strong>₹220</strong></span>
                  <button 
                    className="btn-sm" 
                    onClick={() => openBookingModal('Hanuman Ansh', '4DX', '11:30 AM', 220)}
                  >
                    {currentUser ? 'Book Now' : 'Sign In to Book'}
                  </button>
                </div>
              </div>
            </article>

            {/* Movie 4 */}
            <article className="movie-card">
              <div className="card-thumb">
                <img src="/public/irumudi.jpg" alt="Irumudi" />
                <div className="rating-badge">
                  <i className="fa-solid fa-star"></i> 8.2/10
                </div>
                <div className="tech-badge">UA</div>
              </div>
              <div className="card-body">
                <span className="movie-genre">Action/Drama/Raw</span>
                <h3 className="movie-title">Irumudi</h3>
                <p className="movie-specs">Tamil, Telugu • 2h 05m</p>
                <div className="card-footer">
                  <span className="price-info">From <strong>₹200</strong></span>
                  <button 
                    className="btn-sm" 
                    onClick={() => openBookingModal('Irumudi', '2D', '07:15 PM', 200)}
                  >
                    {currentUser ? 'Book Now' : 'Sign In to Book'}
                  </button>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* ================= ULTIMATE IMMERSION ================= */}
        <section className="section" id="experience">
          <div className="section-center-head">
            <span className="section-tag">ULTIMATE IMMERSION</span>
            <h2 className="section-title">Experience Cinema Like Never Before</h2>
            <p className="section-sub">
              Choose from state-of-the-art projection and sound technologies designed for absolute realism.
            </p>
          </div>

          <div className="immersion-grid">
            <div className="immersion-card">
              <div className="immersion-img-wrap">
                <img src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80" alt="IMAX Laser" />
                <div className="icon-chip">
                  <i className="fa-solid fa-clapperboard"></i>
                </div>
              </div>
              <div className="immersion-info">
                <span className="tech-sub">UNMATCHED CLARITY</span>
                <h3>IMAX Laser 4K</h3>
                <p>
                  Next-gen 4K laser projection with a custom sound engine for sharper, brighter, and deeply immersive scenes.
                </p>
                <a href="#" className="immersion-link">
                  Explore IMAX Screens <i className="fa-solid fa-chevron-right"></i>
                </a>
              </div>
            </div>

            <div className="immersion-card">
              <div className="immersion-img-wrap">
                <img src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80" alt="PVR LUXE" />
                <div className="icon-chip">
                  <i className="fa-solid fa-couch"></i>
                </div>
              </div>
              <div className="immersion-info">
                <span className="tech-sub">SUPREME LUXURY</span>
                <h3>PVR LUXE & Directors</h3>
                <p>
                  Fully reclining leather seats, gourmet menus served at your seat by butler staff, laser-aligned sound, and exclusive lounges.
                </p>
                <a href="#" className="immersion-link">
                  View LUXE Theatres <i className="fa-solid fa-chevron-right"></i>
                </a>
              </div>
            </div>

            <div className="immersion-card">
              <div className="immersion-img-wrap">
                <img src="https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&auto=format&fit=crop&q=80" alt="4DX Motion" />
                <div className="icon-chip">
                  <i className="fa-solid fa-wind"></i>
                </div>
              </div>
              <div className="immersion-info">
                <span className="tech-sub">SENSORY OVERLOAD</span>
                <h3>4DX Motion Seats</h3>
                <p>
                  Synchronized motion seats, wind, rain, lightning, vibrations, and scents that place you directly inside the action.
                </p>
                <a href="#" className="immersion-link">
                  Find 4DX Showtimes <i className="fa-solid fa-chevron-right"></i>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SHOWTIMES ================= */}
        <section className="section">
          <div className="section-header align-end">
            <div>
              <span className="section-tag">REAL-TIME AVAILABILITY</span>
              <h2 className="section-title">Cinemas Near You & Showtimes</h2>
            </div>
            <div className="date-tabs">
              {['Today, 24 Sep', 'Tomorrow, 25 Sep', 'Thu, 26 Sep'].map((dt) => (
                <button 
                  key={dt}
                  className={`date-tab ${activeDate === dt ? 'active' : ''}`}
                  onClick={() => setActiveDate(dt)}
                >
                  {dt}
                </button>
              ))}
            </div>
          </div>

          <div className="cinemas-list">
            {/* Cinema 1 */}
            <div className="cinema-row">
              <div className="cinema-info">
                <div className="cinema-name-row">
                  <h3>PVR ICON: Palladium, Lower Parel</h3>
                  <span className="lux-badge">LUXE</span>
                </div>
                <p className="cinema-sub">
                  <i className="fa-solid fa-location-arrow"></i> Phoenix Palladium, High Street Phoenix, 2.4 KM away
                </p>
                <div className="cinema-amenities">
                  <span><i className="fa-solid fa-mobile-screen"></i> M-Ticket</span>
                  <span><i className="fa-solid fa-burger"></i> Food & Beverage</span>
                  <span><i className="fa-solid fa-volume-high"></i> Dolby Atmos</span>
                </div>
              </div>

              <div className="showtimes-grid">
                {[
                  { time: '10:45 AM', status: 'available', text: 'Available', price: 'MAX 3D • ₹420', val: 420 },
                  { time: '02:15 PM', status: 'filling', text: 'Filling Fast', price: 'MAX 3D • ₹500', val: 500 },
                  { time: '06:30 PM', status: 'almost-full', text: 'Almost Full', price: 'MAX 3D • ₹580', val: 580 },
                  { time: '09:50 PM', status: 'available', text: 'Available', price: 'MAX 3D • ₹450', val: 450 }
                ].map((st, i) => (
                  <button 
                    key={i} 
                    className="showtime-btn" 
                    title={currentUser ? "Click to select seats" : "Sign in required to book"}
                    onClick={() => openBookingModal('Spider-Man: Brand New Day', 'IMAX 3D', st.time, st.val)}
                  >
                    <div className="time">
                      {st.time} {!currentUser && <i className="fa-solid fa-lock" style={{ fontSize: '0.75rem', color: '#a1a1aa' }}></i>}
                    </div>
                    <div className={`status ${st.status}`}>{st.text}</div>
                    <div className="price">{st.price}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Cinema 2 */}
            <div className="cinema-row">
              <div className="cinema-info">
                <div className="cinema-name-row">
                  <h3>INOX Megaplex: Inorbit, Malad</h3>
                  <span className="tech-badge red">IMAX</span>
                </div>
                <p className="cinema-sub">
                  <i className="fa-solid fa-location-arrow"></i> Inorbit Mall, Link Road, Malad West, 8.1 KM away
                </p>
                <div className="cinema-amenities">
                  <span><i className="fa-solid fa-mobile-screen"></i> M-Ticket</span>
                  <span><i className="fa-solid fa-square-parking"></i> Parking</span>
                  <span><i className="fa-solid fa-film"></i> SCREENX</span>
                </div>
              </div>

              <div className="showtimes-grid">
                {[
                  { time: '11:30 AM', status: 'filling', text: 'Filling Fast', price: 'IMAX • ₹450', val: 450 },
                  { time: '03:00 PM', status: 'available', text: 'Available', price: 'IMAX • ₹490', val: 490 },
                  { time: '07:15 PM', status: 'filling', text: 'Filling Fast', price: 'IMAX • ₹590', val: 590 }
                ].map((st, i) => (
                  <button 
                    key={i} 
                    className="showtime-btn" 
                    title={currentUser ? "Click to select seats" : "Sign in required to book"}
                    onClick={() => openBookingModal('Spider-Man: Brand New Day', 'IMAX Laser', st.time, st.val)}
                  >
                    <div className="time">
                      {st.time} {!currentUser && <i className="fa-solid fa-lock" style={{ fontSize: '0.75rem', color: '#a1a1aa' }}></i>}
                    </div>
                    <div className={`status ${st.status}`}>{st.text}</div>
                    <div className="price">{st.price}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================= COMING SOON ================= */}
        <section className="section">
          <div className="section-header">
            <div>
              <span className="section-tag">COMING SOON</span>
              <h2 className="section-title">Advance Booking Open</h2>
            </div>
            <span className="badge-notice">Secure your seats early</span>
          </div>

          <div className="coming-grid">
            {[
              { id: 'joker', img: '/public/joker.jpg', title: 'Joker: Folie à Deux', release: 'Releasing Oct 4', censor: 'A', specs: 'English, Hindi' },
              { id: 'venom', img: '/public/venom.jpg', title: 'Venom: The Last Dance', release: 'Releasing Oct 25', censor: 'UA', specs: 'English, Hindi, Telugu' },
              { id: 'gladiator', img: '/public/gladiator.jpg', title: 'Gladiator II', release: 'Releasing Nov 22', censor: 'A', specs: 'English, Hindi' }
            ].map((mov) => (
              <div key={mov.id} className="coming-card">
                <img src={mov.img} alt={mov.title} />
                <div className="coming-body">
                  <div className="coming-meta-top">
                    <span className="release-date">{mov.release}</span>
                    <span className="censor-tag">{mov.censor}</span>
                  </div>
                  <h4 className="coming-title">{mov.title}</h4>
                  <p className="coming-specs">{mov.specs}</p>
                  <div className="coming-footer">
                    <button 
                      className={`remind-btn ${remindedMovies[mov.id] ? 'active' : ''}`} 
                      onClick={() => toggleRemind(mov.id)}
                    >
                      <i className="fa-regular fa-bell"></i> {remindedMovies[mov.id] ? 'Subscribed' : 'Remind Me'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="footer" id="about">
        <div className="footer-container">
          <div className="footer-col brand-col">
            <a href="#" className="brand-logo">
              Cine<span>Pass</span>
            </a>
            <p>
              The ultimate cinematic experience and ticketing platform across India. Book movies, events, plays, and sports seamlessly.
            </p>
          </div>

          <div className="footer-col">
            <h4>Movies in Bangalore</h4>
            <ul>
              {['Action Movies', 'Bollywood Blockbusters', 'IMAX Screenings', 'Upcoming Releases'].map((item) => (
                <li key={item}><a href="#">{item}</a></li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>Entertainment</h4>
            <ul>
              {['Live Concerts', 'Stand-up Comedy', 'Theatrical Plays', 'Sporting Leagues'].map((item) => (
                <li key={item}><a href="#">{item}</a></li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>Support & Legal</h4>
            <ul>
              {['Help Center', 'Privacy Policy', 'Terms of Service', 'Corporate Governance'].map((item) => (
                <li key={item}><a href="#">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 CinePass India Private Limited. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Security</a>
          </div>
        </div>
      </footer>

      {/* ================= INTERACTIVE SEAT BOOKING MODAL ================= */}
     {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 999999, backdropFilter: 'blur(5px)'
        }}>
          <div style={{
            background: '#18181b', border: '2px solid #e4e4e7', borderRadius: '12px',
            padding: '24px', width: '95%', maxWidth: '500px', color: 'white', position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
          }}>
            
            {/* CLOSE BUTTON */}
            <button 
              onClick={closeBookingModal}
              style={{
                position: 'absolute', top: '16px', right: '16px', 
                background: 'none', border: 'none', color: '#a1a1aa', 
                fontSize: '24px', cursor: 'pointer'
              }}
            >
              ✖
            </button>

            {/* HEADER */}
            <div style={{ borderBottom: '1px solid #3f3f46', paddingBottom: '16px', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '8px', color: '#ffffff' }}>{modalData.title}</h2>
              <p style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>
                {modalData.format} • {modalData.time} • ₹{modalData.price}/seat
              </p>
            </div>

            {/* SCREEN GRAPHIC */}
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
              <div style={{ 
                height: '4px', background: '#ef4444', width: '80%', 
                margin: '0 auto', borderRadius: '50%', boxShadow: '0 5px 15px rgba(239, 68, 68, 0.5)'
              }}></div>
              <p style={{ color: '#a1a1aa', fontSize: '0.75rem', marginTop: '10px', letterSpacing: '2px' }}>SCREEN THIS WAY</p>
            </div>

            {/* SEATS GRID */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', marginBottom: '30px' }}>
              {seatRows.map((row) => (
                <div key={row} style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ width: '20px', color: '#a1a1aa', display: 'flex', alignItems: 'center' }}>{row}</span>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
                    const seatId = `${row}${num}`;
                    const isSelected = selectedSeats.includes(seatId);
                    return (
                      <button
                        key={seatId}
                        onClick={() => toggleSeat(seatId)}
                        style={{
                          width: '35px', height: '35px', 
                          borderRadius: '6px', border: '1px solid #e4e4e7',
                          background: isSelected ? '#ef4444' : '#27272a',
                          color: isSelected ? 'white' : '#a1a1aa',
                          cursor: 'pointer', fontSize: '0.8rem',
                          transition: 'all 0.2s ease-in-out'
                        }}
                      >
                        {num}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* FOOTER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #3f3f46', paddingTop: '20px' }}>
              <div>
                <p style={{ color: '#a1a1aa', fontSize: '0.85rem' }}>Total Amount</p>
                <h3 style={{ fontSize: '1.5rem', color: '#ffffff', margin: 0 }}>₹{selectedSeats.length * modalData.price}</h3>
              </div>
              <button 
                onClick={() => {
                  if (selectedSeats.length === 0) {
                    alert('Please select at least one seat.');
                    return;
                  }
                  alert(`Booking Confirmed! Seats: ${selectedSeats.join(', ')}. Total: ₹${selectedSeats.length * modalData.price}`);
                  closeBookingModal();
                }}
                style={{
                  background: '#ef4444', color: 'white', border: 'none', 
                  padding: '12px 24px', borderRadius: '8px', fontSize: '1rem', 
                  fontWeight: 'bold', cursor: 'pointer'
                }}
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;