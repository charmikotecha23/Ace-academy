import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [role, setRole] = useState("Student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [dbStudents, setDbStudents] = useState([]);
  const [newName, setNewName] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newMarks, setNewMarks] = useState("");

  // Calculate real dynamic numbers from your database
  const uniqueCoursesCount = new Set(dbStudents.map(student => student.subject)).size;

  useEffect(() => {
    if (showAdminDashboard || showDashboard) {
      fetch("http://localhost:5000/api/students")
        .then((res) => res.json())
        .then((data) => setDbStudents(data))
        .catch((err) => console.error("Error connecting to database:", err));
    }
  }, [showAdminDashboard, showDashboard]);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      await fetch("http://localhost:5000/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, subject: newSubject, marks: newMarks })
      });
      
      const res = await fetch("http://localhost:5000/api/students");
      const data = await res.json();
      setDbStudents(data);
      
      setNewName("");
      setNewSubject("");
      setNewMarks("");
    } catch (err) {
      console.error("Failed to save to database", err);
    }
  };

  // REAL LOGIN LOGIC
  function handleLogin(event) {
    event.preventDefault();

    if (!email.trim() || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    setMessage("");

    if (role === "Admin/Teacher") {
      // Secure Admin Login
      if (email === "admin@aceacademy.com" && password === "admin123") {
        setShowLogin(false);
        setShowDashboard(false);
        setShowAdminDashboard(true);
      } else {
        setMessage("Invalid credentials. Hint: admin@aceacademy.com / admin123");
      }
    } else {
      // Student Login (accepts any email for the demo)
      setShowLogin(false);
      setShowDashboard(true);
      setShowAdminDashboard(false);
    }
  }

  function openLogin() {
    setMessage("");
    setShowLogin(true);
    setShowDashboard(false);
    setShowAdminDashboard(false);
  }

  function goHome() {
    setShowLogin(false);
    setShowDashboard(false);
    setShowAdminDashboard(false);
    setMessage("");
    setPassword("");
  }

  // ADMIN / TEACHER DASHBOARD
  if (showAdminDashboard) {
    return (
      <div className="dashboard-page">
        <nav className="navbar">
          <h2>🎓 Ace Academy</h2>
          <button className="login-btn" onClick={goHome}>Logout</button>
        </nav>

        <main className="dashboard-container">
          <div className="dashboard-heading">
            <p className="tagline">ADMINISTRATION PORTAL</p>
            <h1>Admin Dashboard 👋</h1>
            <p>Manage students, courses and academic performance.</p>
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-card">
              <span>👨‍🎓</span>
              <h3>Total Students</h3>
              <h2>{dbStudents.length}</h2>
              <p>Live database records</p>
            </div>

            <div className="dashboard-card">
              <span>📚</span>
              <h3>Active Courses</h3>
              <h2>{uniqueCoursesCount}</h2>
              <p>Counted from database</p>
            </div>

            <div className="dashboard-card">
              <span>📊</span>
              <h3>Database Status</h3>
              <h2>Online</h2>
              <p>Connected to MongoDB</p>
            </div>
          </div>

          <section className="dashboard-section">
            <h2>Add New Student</h2>
            <form onSubmit={handleAddStudent} style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <input 
                type="text" placeholder="Student Name" value={newName} 
                onChange={(e) => setNewName(e.target.value)} required 
                style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              />
              <input 
                type="text" placeholder="Subject" value={newSubject} 
                onChange={(e) => setNewSubject(e.target.value)} required 
                style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              />
              <input 
                type="number" placeholder="Marks (out of 100)" value={newMarks} 
                onChange={(e) => setNewMarks(e.target.value)} required 
                style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              />
              <button type="submit" className="login-btn" style={{ margin: 0 }}>Save to Database</button>
            </form>
          </section>

          <section className="dashboard-section">
            <h2>Live Student Records</h2>
            <div className="student-table-wrap">
              <table className="student-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Course/Subject</th>
                    <th>Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {dbStudents.map((student) => (
                    <tr key={student._id || student.name}>
                      <td>{student.name}</td>
                      <td>{student.subject}</td>
                      <td>{student.marks}/100</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    );
  }

  // STUDENT DASHBOARD
  if (showDashboard) {
    return (
      <div className="dashboard-page">
        <nav className="navbar">
          <h2>🎓 Ace Academy</h2>
          <button className="login-btn" onClick={goHome}>Logout</button>
        </nav>
        <main className="dashboard-container">
          <div className="dashboard-heading">
            <p className="tagline">STUDENT PORTAL</p>
            <h1>Welcome! 👋</h1>
          </div>
          <div className="dashboard-profile">
            <div className="profile-avatar">🎓</div>
            <div>
              <h2>Student Profile</h2>
              <p>Email: {email}</p>
              <p>Role: Student</p>
            </div>
          </div>
          <section className="dashboard-section">
            <h2>Academy Course Directory</h2>
            <div className="dashboard-list">
              {[...new Set(dbStudents.map(s => s.subject))].map((course, i) => (
                <p key={i}>📘 {course} <span>Active</span></p>
              ))}
            </div>
          </section>
        </main>
      </div>
    );
  }

  // LOGIN PAGE
  if (showLogin) {
    return (
      <div className="login-page">
        <nav className="navbar login-navbar">
          <h2 onClick={goHome} className="brand-click">🎓 Ace Academy</h2>
          <button className="login-btn" onClick={goHome}>Back to Home</button>
        </nav>
        <main className="login-container">
          <div className="login-card">
            <div className="login-icon">🎓</div>
            <p className="tagline">WELCOME BACK</p>
            <h1>Login to Ace Academy</h1>
            <div className="role-selector">
              <button
                type="button"
                className={role === "Student" ? "role-btn active" : "role-btn"}
                onClick={() => { setRole("Student"); setMessage(""); }}
              >
                🎒 Student
              </button>
              <button
                type="button"
                className={role === "Admin/Teacher" ? "role-btn active" : "role-btn"}
                onClick={() => { setRole("Admin/Teacher"); setMessage(""); }}
              >
                👩‍🏫 Admin/Teacher
              </button>
            </div>
            <form onSubmit={handleLogin}>
              <label htmlFor="email">Email Address</label>
              <input
                id="email" type="email" placeholder="Enter your email"
                value={email} onChange={(event) => setEmail(event.target.value)} required
              />
              <label htmlFor="password">Password</label>
              <input
                id="password" type="password" placeholder="Enter your password"
                value={password} onChange={(event) => setPassword(event.target.value)} required
              />
              <button className="submit-login" type="submit">Login as {role} →</button>
            </form>
            {message && <p className="login-message" role="status">{message}</p>}
          </div>
        </main>
      </div>
    );
  }

  // HOME PAGE
  return (
    <div className="app">
      <nav className="navbar">
        <h2>🎓 Ace Academy</h2>
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#courses">Courses</a>
        </div>
        <button className="login-btn" onClick={openLogin}>Login</button>
      </nav>
      <section className="hero" id="home">
        <div className="hero-content">
          <p className="tagline">WELCOME TO ACE ACADEMY</p>
          <h1>Your Success Starts <span>Here.</span></h1>
          <a className="primary-btn" href="#courses">Explore Courses →</a>
        </div>
      </section>
    </div>
  );
}

export default App;