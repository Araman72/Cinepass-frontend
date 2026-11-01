function UserDashboard({ user, onLogout, onGoHome }) {
  return (
    <div className="dashboard-container">
      {/* 1. Left Navigation Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand ">👤 User Portal</div>
        <ul className="sidebar-menu">
          <li className="active">My Profile</li>
          <li>My Account</li>
          <li>Security</li>
          {/* Optional: Add Home link in sidebar */}
          <li onClick={onGoHome} style={{ cursor: 'pointer', color: '#f83838' }}>
            🏠 Back to Home
          </li>
        </ul>
      </aside>

      {/* 2. Main Content Area */}
      <main className="main-content">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span>Welcome User, <strong>{user.email}</strong></span>
            {/* Home button in topbar */}
            <button 
              onClick={onGoHome} 
              style={{
                background: '#a40e0e',
                color: '#f8fafc',
                border: '1px solid #475569',
                padding: '6px 14px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              🏠 Home Page
            </button>
          </div>
          <button className="logout-btn" onClick={onLogout}>Log Out</button>
        </header>

        <section className="content-body">
          <div className="stats-grid">
            <div className="stat-card">
              <h4>Account Role</h4>
              <p style={{ color: '#f85e38', fontSize: '1.6rem', textTransform: 'capitalize' }}>
                {user.role}
              </p>
            </div>
            <div className="stat-card">
              <h4>Account Status</h4>
              <p style={{ color: '#22c55e', fontSize: '1.6rem' }}>Active</p>
            </div>
            <div className="stat-card">
              <h4>Access Level</h4>
              <p style={{ color: '#f8fafc', fontSize: '1.6rem' }}>Standard</p>
            </div>
          </div>

          <div className="panel-card">
            <h3>Personal Information Area</h3>
            <p style={{ color: '#94a3b8', marginTop: '8px', marginBottom: '20px' }}>
              Your personal account details and access overview.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>
                <span style={{ color: '#94a3b8' }}>Registered Email:</span>
                <strong>{user.email}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>
                <span style={{ color: '#94a3b8' }}>Phone Number:</span>
                <strong>{user.phone || 'Not Provided'}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>
                <span style={{ color: '#94a3b8' }}>Account Type:</span>
                <span style={{ color: '#f8383e', fontWeight: 'bold', textTransform: 'capitalize' }}>{user.role}</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default UserDashboard;