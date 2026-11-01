import React, { useEffect } from 'react';
import './about.css';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const About = () => {
  useEffect(() => {
    // Safely reference gsap/ScrollTrigger whether loaded via CDN (window) or npm imports
    const gsapInstance = window.gsap || (typeof gsap !== "undefined" ? gsap : null);
    const scrollTriggerInstance = window.ScrollTrigger || (typeof ScrollTrigger !== "undefined" ? ScrollTrigger : null);

    /* ==========================================================================
       DYNAMIC GSAP SCROLL & LOAD TRANSITIONS
       ========================================================================== */
   /* ==========================================================================
       DYNAMIC GSAP SCROLL & LOAD TRANSITIONS
       ========================================================================== */
    function initAnimations() {
      const hasTrigger = !!scrollTriggerInstance;

      // 1. Navbar & Hero Entry (Runs instantly on start)
      // FIX: Changed from .from() to .fromTo() to prevent React Strict Mode 
      // from permanently hiding the text during component re-renders.
      const introTL = gsapInstance.timeline({ defaults: { ease: "power3.out" } });
      
      introTL
        .fromTo(".navbar", { y: -40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6 })
        .fromTo(".gradient-text", { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7 }, "-=0.2")
        .fromTo(".sub-title", { y: 15, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5 }, "-=0.4")
        .fromTo(".hero-buttons", { y: 10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4 }, "-=0.3")
        .fromTo(".scroll-indicator", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, "-=0.1");

      // 2. Auxiliary Helper function for Grid sections
      const fadeUpGrid = (elementsSelector, triggerSelector) => {
        const targets = document.querySelectorAll(elementsSelector);
        const trigger = document.querySelector(triggerSelector);
        
        if (!targets.length || !trigger) return;

        if (hasTrigger) {
          gsapInstance.fromTo(targets, 
            { autoAlpha: 0, y: 30 }, // FIX: Using autoAlpha instead of opacity
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.12,
              ease: "power2.out",
              clearProps: "all",
              scrollTrigger: {
                trigger: trigger,
                start: "top 85%",
                toggleActions: "play none none none",
                once: true
              }
            }
          );
        } else {
          gsapInstance.set(targets, { autoAlpha: 1, y: 0 });
        }
      };

      // Bind Scroll triggers to target Grid sections
      fadeUpGrid(".mission-card", ".mission-grid");
      fadeUpGrid(".team-card", ".team-grid");
      fadeUpGrid(".exp-card", ".exp-grid");

      // 3. Independent Trigger function for vertical Timeline items
      const timelineItems = document.querySelectorAll(".timeline-item");
      timelineItems.forEach((item) => {
        if (hasTrigger) {
          gsapInstance.fromTo(item, 
            { autoAlpha: 0, y: 40 }, // FIX: Using autoAlpha instead of opacity
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              clearProps: "all",
              scrollTrigger: {
                trigger: item,
                start: "top 85%",
                toggleActions: "play none none none",
                once: true
              }
            }
          );
        } else {
          gsapInstance.set(item, { autoAlpha: 1, y: 0 });
        }
      });

      // FIX: Force ScrollTrigger to recalculate positions shortly after loading
      // This ensures that if custom fonts or images push the layout down, 
      // the triggers will fire precisely when the user arrives at them.
      if (hasTrigger) {
        setTimeout(() => scrollTriggerInstance.refresh(), 150);
      }
    }
    /* ==========================================================================
       INTERACTIVE INCREMENTAL STAT COUNTERS
       ========================================================================== */
    function initCounters() {
      const statNumbers = document.querySelectorAll(".stat-num");
      const hasTrigger = !!scrollTriggerInstance;

      statNumbers.forEach((stat) => {
        const targetValue = parseFloat(stat.getAttribute("data-target"));
        const suffix = stat.querySelector("span") ? stat.querySelector("span").textContent : "";
        const counterObj = { value: 0 };

        if (hasTrigger) {
          gsapInstance.to(counterObj, {
            value: targetValue,
            scrollTrigger: {
              trigger: stat,
              start: "top 90%",
              toggleActions: "play none none none",
              once: true
            },
            duration: 1.5,
            ease: "power1.out",
            onUpdate: () => {
              if (targetValue % 1 !== 0) {
                stat.innerHTML = `${counterObj.value.toFixed(1)}<span>${suffix}</span>`;
              } else {
                stat.innerHTML = `${Math.floor(counterObj.value)}<span>${suffix}</span>`;
              }
            }
          });
        } else {
          stat.innerHTML = `${targetValue}<span>${suffix}</span>`;
        }
      });
    }

    /* ==========================================================================
       INITIALIZATION & CLEANUP
       ========================================================================== */
    if (gsapInstance) {
      if (scrollTriggerInstance) {
        gsapInstance.registerPlugin(scrollTriggerInstance);
      }
      // YOU MUST CALL THE FUNCTIONS HERE FOR THEM TO RUN
      initAnimations();
      initCounters();
    } else {
      // Fallback
      document.querySelectorAll(".stat-num").forEach(num => {
        num.innerHTML = `${num.getAttribute("data-target")}<span>${num.querySelector("span")?.textContent || ''}</span>`;
      });
    }

    // Cleanup function when component unmounts
    return () => {
      if (scrollTriggerInstance) {
        scrollTriggerInstance.getAll().forEach(trigger => trigger.kill());
      }
    };
  }, []); // THE MISSING CLOSING BRACKETS FOR USEEFFECT

  return (
    <div className="about-page">
      {/* ================= NAVBAR ================= */}
      <header className="navbar">
        <div className="nav-container">
          <div className="nav-left">
            <a href="#" className="brand-logo">Cine<span>Pass</span></a>
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
            <div className="user-avatar" title="My Profile">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces" alt="Avatar" />
            </div>
          </div>
        </div>
      </header>

      {/* ================= HERO SECTION WITH VIDEO ================= */}
      <section className="hero-section">
        <div className="video-container">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="video-bg" 
            poster="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600&auto=format&fit=crop&q=70"
          >
            <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
          </video>
          <div className="video-overlay"></div>
          <div className="particle-overlay"></div>
        </div>

        <div className="hero-content">
          <h1 className="gradient-text hero-title">REDEFINING THE<br />MAGIC OF CINEMA</h1>
          <h2 className="sub-title">This is <span>CinePass</span></h2>
          
          <div className="hero-buttons">
            <a href="#history" className="btn btn-primary">Explore Our History</a>
            <a href="#team" className="btn btn-secondary">Meet the Team</a>
          </div>

          <div className="scroll-indicator">
            <div className="mouse-scroll">
              <div className="scroll-dot"></div>
            </div>
            <span>Scroll to Explore</span>
          </div>
        </div>
      </section>

      {/* ================= THE MISSION ================= */}
      <section className="section">
        <div className="section-title-wrap">
          <span className="section-tag">THE MISSION</span>
          <h2>Card Stagger</h2>
        </div>

        <div className="mission-grid">
          <div className="mission-card">
            <div className="card-icon red"><i className="fa-solid fa-clapperboard"></i></div>
            <h3>Unmatched Experience</h3>
            <p>Providing premium cinema experiences with top-tier seats, audio projection, and immersive features you cannot find anywhere else.</p>
          </div>

          <div className="mission-card">
            <div className="card-icon orange"><i className="fa-solid fa-ticket"></i></div>
            <h3>Innovation First</h3>
            <p>Continually innovating ticket bookings, visual standards, digital options, and customer interactive experiences.</p>
            <span className="link-hover">Hover Effects <i className="fa-solid fa-chevron-right"></i></span>
          </div>

          <div className="mission-card">
            <div className="card-icon yellow"><i className="fa-solid fa-users"></i></div>
            <h3>Community Powered</h3>
            <p>Built with feedback to bring cinema communities together, supporting reviews, priority passes, and bulk event layouts.</p>
          </div>
        </div>
      </section>

      {/* ================= TIMELINE ================= */}
      <section id="history" className="section">
        <div className="section-title-wrap">
          <span className="section-tag">STORY & MILESTONE TIMELINE</span>
          <h2>Interactive Timeline</h2>
        </div>

        <div className="timeline">
          <div className="timeline-line"></div>

          <div className="timeline-item left">
            <div className="timeline-node"></div>
            <div className="timeline-card">
              <span className="timeline-year">2018: The Spark</span>
              <p>The original blueprint for an interactive connecting cinematic booking network.</p>
            </div>
          </div>

          <div className="timeline-item right">
            <div className="timeline-node"></div>
            <div className="timeline-card inline-img-right">
              <div className="timeline-text">
                <span className="timeline-year">2021: Timeline</span>
                <p>Launched ticketing framework with real-time cinema seating maps and analytics.</p>
              </div>
              <img src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&auto=format&fit=crop" alt="Cinema screen" className="timeline-thumb" />
            </div>
          </div>

          <div className="timeline-item left">
            <div className="timeline-node"></div>
            <div className="timeline-card inline-img-left">
              <img src="https://images.unsplash.com/photo-1509281373149-e957c6296406?w=400&auto=format&fit=crop" alt="Production" className="timeline-thumb" />
              <div className="timeline-text">
                <span className="timeline-year">2023: Plannam</span>
                <p>Integrating direct hardware with theater operators for digital scanning, concessions, and smart lounge entry.</p>
              </div>
            </div>
          </div>

          <div className="timeline-item right">
            <div className="timeline-node"></div>
            <div className="timeline-card">
              <span className="timeline-year">2023: Screen Partners</span>
              <p>Multiplied national partners including PVR, INOX, and premier IMAX/4DX centers.</p>
            </div>
          </div>

          <div className="timeline-item right">
            <div className="timeline-node"></div>
            <div className="timeline-card inline-img-right">
              <div className="timeline-text">
                <span className="timeline-year">2026: Redefining Film</span>
                <p>Deploying personalized, cinematic viewing passes and fully customized seat grids.</p>
              </div>
              <img src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&auto=format&fit=crop" alt="Theater Room" className="timeline-thumb" />
            </div>
          </div>
        </div>
      </section>

      {/* ================= THE NUMBERS ================= */}
      <section className="section stats-container">
        <div className="section-title-wrap centered">
          <span className="section-tag">THE NUMBERS</span>
          <h2>Stats Counters</h2>
        </div>

        <div className="stats-grid">
          <div className="stat-item">
            <h3 className="stat-num" data-target="50">0<span>M+</span></h3>
            <p>Tickets Sold</p>
          </div>
          <div className="stat-item">
            <h3 className="stat-num" data-target="120">0<span>+</span></h3>
            <p>Cities</p>
          </div>
          <div className="stat-item">
            <h3 className="stat-num" data-target="800">0<span>+</span></h3>
            <p>Screen Partners</p>
          </div>
          <div className="stat-item">
            <h3 className="stat-num" data-target="4.8">0<span>★</span></h3>
            <p>Rating</p>
          </div>
        </div>
      </section>

      {/* ================= THE VISIONARIES ================= */}
      <section id="team" className="section">
        <div className="section-title-wrap">
          <span className="section-tag">MEET THE VISIONARIES</span>
          <h2>Team Grid</h2>
        </div>

        <div className="team-grid">
          <div className="team-card">
            <div className="avatar-wrap">
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop" alt="Sionasss Leader" />
              <div className="role-overlay">Co-Founder & CEO</div>
            </div>
            <div className="team-info">
              <h3>Sionasss Leader</h3>
              <p>Professional Leader</p>
            </div>
          </div>

          <div className="team-card">
            <div className="avatar-wrap">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop" alt="Grander Leader" />
              <div className="role-overlay">Chief Operating Officer</div>
            </div>
            <div className="team-info">
              <h3>Grander Leader</h3>
              <p>Professional Leaders</p>
            </div>
          </div>

          <div className="team-card">
            <div className="avatar-wrap">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop" alt="Asinch Leader" />
              <div className="role-overlay">Head of Technology</div>
            </div>
            <div className="team-info">
              <h3>Asinch Leader</h3>
              <p>Professional Professional</p>
            </div>
          </div>

          <div className="team-card">
            <div className="avatar-wrap">
              <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop" alt="Benel Leaders" />
              <div className="role-overlay">Chief Creative Officer</div>
            </div>
            <div className="team-info">
              <h3>Benel Leaders</h3>
              <p>Professional Officer</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= THE EXPERIENCES ================= */}
      <section className="section">
        <div className="section-title-wrap">
          <span className="section-tag">THE EXPERIENCES</span>
          <h2>Interactive grid</h2>
        </div>

        <div className="exp-grid">
          <div className="exp-card">
            <img src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&auto=format&fit=crop" alt="Luxury Recliners" />
            <div className="exp-content">
              <span className="exp-icon"><i className="fa-solid fa-chair"></i></span>
              <h3>Luxury Recliners</h3>
              <p>Extremely comfortable seating to elevate high-end films.</p>
            </div>
          </div>

          <div className="exp-card">
            <img src="https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&auto=format&fit=crop" alt="Epic 4DX Motion" />
            <div className="exp-content">
              <span className="exp-icon"><i className="fa-solid fa-wind"></i></span>
              <h3>Epic 4DX Motion</h3>
              <p>Interactive sensory cues and environment syncs.</p>
            </div>
          </div>

          <div className="exp-card">
            <img src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop" alt="Laser 4K Projection" />
            <div className="exp-content">
              <span className="exp-icon"><i className="fa-solid fa-photo-film"></i></span>
              <h3>Laser 4K Projection</h3>
              <p>Deep black levels and unmatched clarity across standard partnering theaters.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CALL TO ACTION ================= */}
      <section className="section">
        <div className="cta-banner">
          <span className="cta-subtitle">DISCOVER THE STORY</span>
          <h2>Be Part of the Story</h2>
          <button className="btn btn-primary btn-large">Explore Now</button>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-col brand-col">
            <a href="#" className="brand-logo">Cine<span>Pass</span></a>
            <p>Our cinepass connecting experience and communications, immersive technology options to make standard booking visual.</p>
          </div>

          <div className="footer-col">
            <h4>Movies in Bangalore</h4>
            <ul>
              <li><a href="#">Action Movies</a></li>
              <li><a href="#">Bollywood Blockbusters</a></li>
              <li><a href="#">IMAX Screenings</a></li>
              <li><a href="#">Upcoming Releases</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Entertainment</h4>
            <ul>
              <li><a href="#">Live Concerts</a></li>
              <li><a href="#">Stand-up Comedy</a></li>
              <li><a href="#">Theatrical Plays</a></li>
              <li><a href="#">Sporting Leagues</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Support & Legal</h4>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Corporate Governance</a></li>
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
    </div>
  );
};

export default About;