import { useState } from 'react';
import Home from './Home'; 
import Login from './Login';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';
import './index.css';
import { Route, Routes } from 'react-router-dom';
import About from './About';
import Experience from './Experience';
import Theater from './Theater';
import Theater2 from './Theater2';
import Contact from './Contact';


function App() {





  // 1. Declare the state properly
  const [currentUser, setCurrentUser] = useState(null); 
  const [currentView, setCurrentView] = useState('home'); // 'home', 'login', or 'dashboard'

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('home');
  };

  // 2. ADMIN DASHBOARD
  if (currentUser && currentUser.role === 'admin' && currentView === 'dashboard') {
    return (
      <AdminDashboard 
        user={currentUser} 
        onLogout={handleLogout} 
        onGoHome={() => setCurrentView('home')} 
      />
    );
  }

  // 3. USER DASHBOARD
  if (currentUser && currentUser.role === 'user' && currentView === 'dashboard') {
    return (
      <UserDashboard 
        user={currentUser} 
        onLogout={handleLogout} 
        onGoHome={() => setCurrentView('home')} 
      />
    );
  }

  // 4. LOGIN SCREEN
  if (currentView === 'login') {
    return (
      <div>
        <div style={{ padding: '16px 32px', background: '#1e293b', borderBottom: '1px solid #334155' }}>
          <button 
            onClick={() => setCurrentView('home')}
            style={{ 
              background: 'transparent', 
              border: '1px solid #475569', 
              color: '#cbd5e1', 
              padding: '6px 14px', 
              borderRadius: '6px', 
              cursor: 'pointer' 
            }}
          >
            ← Back to Home
          </button>
        </div>
        <Login onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  // 5. HOME PAGE (pass currentUser down as a prop)
  return (
    <div className="app-container">


      <Routes>
        <Route 
          path="/" 
          element={
            <Home 
              currentUser={currentUser} 
              onNavigateLogin={() => setCurrentView('login')} 
              onNavigateDashboard={() => setCurrentView('dashboard')} 
              onLogout={handleLogout} 
            />
          } 
        />
        <Route path="/about" element={<About />} />
      <Route path="/experience" element={<Experience/>} />
      <Route path="/theater" element={<Theater/>}/>
      <Route path="/theater2" element={<Theater2 />} />
      <Route path="/contact" element={<Contact />} />
        <Route 
          path="/login" 
          element={<Login onLoginSuccess={handleLoginSuccess} />} 
        />

        
      </Routes>
    </div>
  );
}

export default App;