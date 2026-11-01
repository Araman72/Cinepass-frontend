import { useState } from 'react';

function AdminDashboard({ user, onLogout, onGoHome }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchUsers = async () => {
    setActiveTab('users');
    setLoading(true);
    setErrorMsg('');
    try {
     const response = await fetch('https://cinepass-backend-1.onrender.com/api/users');
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch users');
      setUsersList(data);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      {/* 1. Admin Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">🎬 Movie Admin</div>
        <ul className="sidebar-menu">
          <li 
            className={activeTab === 'dashboard' ? 'active' : ''} 
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </li>
          <li>Movies List</li>
          <li 
            className={activeTab === 'users' ? 'active' : ''} 
            onClick={fetchUsers}
          >
            Users
          </li>
          <li>Settings</li>
          <li onClick={onGoHome} style={{ cursor: 'pointer', color: '#38bdf8' }}>
            🏠 Back to Home
          </li>
        </ul>
      </aside>

      {/* 2. Admin Content Area */}
      <main className="main-content">
        <header className="topbar">
          <span>Welcome Admin, <strong>{user?.email}</strong></span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={onGoHome}
              style={{
                background: '#334155',
                color: '#fff',
                border: '1px solid #475569',
                padding: '8px 14px',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Home Page
            </button>
            <button className="logout-btn" onClick={onLogout}>
              Log Out
            </button>
          </div>
        </header>

        <section className="content-body">
          {/* VIEW 1: DASHBOARD STATS */}
          {activeTab === 'dashboard' && (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <h4>Total Movies</h4>
                  <p>124</p>
                </div>
                <div className="stat-card">
                  <h4>Active Users</h4>
                  <p>{usersList.length > 0 ? usersList.length : '1,480'}</p>
                </div>
                <div className="stat-card">
                  <h4>Cluster Status</h4>
                  <p style={{ color: '#22c55e', fontSize: '1.2rem' }}>Connected</p>
                </div>
              </div>

              <div className="panel-card">
                <h3>Admin Management Area</h3>
                <p style={{ color: '#94a3b8', marginTop: '10px' }}>
                  Full system control: click on <strong>Users</strong> in the sidebar to view all accounts in your database.
                </p>
              </div>
            </>
          )}

          {/* VIEW 2: ALL USERS TABLE */}
          {activeTab === 'users' && (
            <div className="panel-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h3>Registered Users</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
                    Live list of all user accounts registered in MongoDB Atlas.
                  </p>
                </div>
                <button
                  onClick={fetchUsers}
                  style={{
                    background: '#0284c7',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  🔄 Refresh
                </button>
              </div>

              {loading && <p style={{ color: '#38bdf8' }}>Fetching users from database...</p>}
              {errorMsg && <p style={{ color: '#ef4444' }}>{errorMsg}</p>}

              {!loading && !errorMsg && (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #334155', color: '#94a3b8', fontSize: '0.9rem' }}>
                        <th style={{ padding: '12px 14px' }}>#</th>
                        <th style={{ padding: '12px 14px' }}>Email Address</th>
                        <th style={{ padding: '12px 14px' }}>Phone Number</th>
                        <th style={{ padding: '12px 14px' }}>Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList.length === 0 ? (
                        <tr>
                          <td colSpan="4" style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                            No users found in database.
                          </td>
                        </tr>
                      ) : (
                        usersList.map((item, index) => (
                          <tr key={item._id || index} style={{ borderBottom: '1px solid #334155' }}>
                            <td style={{ padding: '14px', color: '#64748b' }}>{index + 1}</td>
                            <td style={{ padding: '14px', fontWeight: '500' }}>{item.email}</td>
                            <td style={{ padding: '14px', color: '#cbd5e1' }}>{item.phone || '—'}</td>
                            <td style={{ padding: '14px' }}>
                              <span 
                                style={{
                                  padding: '4px 10px',
                                  borderRadius: '20px',
                                  fontSize: '0.8rem',
                                  fontWeight: '600',
                                  textTransform: 'uppercase',
                                  backgroundColor: item.role === 'admin' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                                  color: item.role === 'admin' ? '#38bdf8' : '#22c55e',
                                  border: item.role === 'admin' ? '1px solid #38bdf8' : '1px solid #22c55e'
                                }}
                              >
                                {item.role}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;