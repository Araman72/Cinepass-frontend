import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { Link } from 'react-router-dom';
import './Contact.css';


const Contact = () => {
  const [state, handleSubmit] = useForm("xqppypeb");

  if (state.succeeded) {
    return (
      <div className="contact-success-page">
        <div className="contact-success-card">
          <svg className="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h2>Thanks for your feedback!</h2>
          <p>Our support team at CineNova will review your message and get back to you before the next screening.</p>
        </div>
      </div>
    );
  }

  return (
    <>
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


 <div className="contact-page">
 



      <div className="contact-card">
        
        {/* Context & Info Section */}
        <div className="contact-info">
          <div className="info-content">
            <h2>Contact Cinepass</h2>
            <p className="info-description">
              Need help with a recent ticket booking, have a question about a refund, or want to share feedback about your theater experience? We'd love to hear from you.
            </p>
            <ul className="info-list">
              <li>
                <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                support@cinenova.com
              </li>
              <li>
                <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Fast response within 24 hours
              </li>
            </ul>
          </div>
          <div className="decorative-glow"></div>
        </div>

        {/* Form Section */}
        <div className="contact-form-container">
          <h3>Send us a message</h3>
          <form onSubmit={handleSubmit} className="contact-form">
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email" 
                name="email"
                placeholder="moviebuff@example.com"
                required
              />
              <ValidationError 
                prefix="Email" 
                field="email"
                errors={state.errors}
                className="error-message"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Your Feedback / Inquiry</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                placeholder="Tell us about your experience or issue..."
                required
              />
              <ValidationError 
                prefix="Message" 
                field="message"
                errors={state.errors}
                className="error-message"
              />
            </div>

            <button type="submit" disabled={state.submitting} className="submit-btn">
              {state.submitting ? 'Sending...' : 'Submit Feedback'}
            </button>
          </form>
        </div>
        
      </div>
    </div>
    
    </>
   
  );
}

export default Contact;