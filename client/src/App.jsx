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

  // --- NEW: Database States ---
  const [dbStudents, setDbStudents] = useState([]);
  const [newName, setNewName] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newMarks, setNewMarks] = useState("");

  // --- NEW: Fetch Data from Backend ---
  useEffect(() => {
    if (showAdminDashboard) {
      fetch("http://localhost:5000/api/students")
        .then((res) => res.json())
        .then((data) => setDbStudents(data))
        .catch((err) => console.error("Error connecting to database:", err));
    }
  }, [showAdminDashboard]);

  // --- NEW: Add Student to Backend ---
  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      await fetch("http://localhost:5000/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, subject: newSubject, marks: newMarks })
      });
      
      // Refresh the database list after adding
      const res = await fetch("http://localhost:5000/api/students");
      const data = await res.json();
      setDbStudents(data);
      
      // Clear form boxes
      setNewName("");
      setNewSubject("");
      setNewMarks("");
    } catch (err) {
      console.error("Failed to save to database", err);
    }
  };

  function handleLogin(event) {
    event.preventDefault();

    if (!email.trim() || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    setMessage("");

    if (role === "Student") {
      setShowLogin(false);
      setShowDashboard(true);
      setShowAdminDashboard(false);
    } else {
      setShowLogin(false);
      setShowDashboard(false);
      setShowAdminDashboard(true);
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
          <button className="login-btn" onClick={goHome}>
            Logout
          </button>
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
              <h2>3</h2>
              <p>Courses offered</p>
            </div>

            <div className="dashboard-card">
              <span>📊</span>
              <h3>Database Status</h3>
              <h2>Online</h2>
              <p>Connected to MongoDB</p>
            </div>
          </div>

          {/* NEW: Add Student Form */}
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
              <button type="submit" className="login-btn" style={{ margin: 0 }}>
                Save to Database
              </button>
            </form>
          </section>

          <section className="dashboard-section">
            <h2>Live Student Records</h2>
            <p className="section-desc">
              Data pulled directly from MongoDB.
            </p>

            <div className="student-table-wrap">
              <table className="student-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Course/Subject</th>
                    <th>Attendance</th>
                    <th>Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {dbStudents.map((student) => (
                    <tr key={student._id || student.name}>
                      <td>{student.name}</td>
                      <td>{student.subject}</td>
                      <td>95%</td> {/* Default display */}
                      <td>{student.marks}/100</td>
                    </tr>
                  ))}
                  {dbStudents.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No students found in database. Add one above!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>

        <footer>
          <h2>🎓 Ace Academy</h2>
          <p>Learn today. Lead tomorrow.</p>
          <p>© 2026 Ace Academy. All rights reserved.</p>
        </footer>
      </div>
    );
  }

  // STUDENT DASHBOARD
  if (showDashboard) {
    return (
      <div className="dashboard-page">
        <nav className="navbar">
          <h2>🎓 Ace Academy</h2>
          <button className="login-btn" onClick={goHome}>
            Logout
          </button>
        </nav>

        <main className="dashboard-container">
          <div className="dashboard-heading">
            <p className="tagline">STUDENT PORTAL</p>
            <h1>Welcome, Student! 👋</h1>
            <p>Here is your academic overview.</p>
          </div>

          <div className="dashboard-profile">
            <div className="profile-avatar">🎓</div>
            <div>
              <h2>Student Profile</h2>
              <p>Email: {email}</p>
              <p>Role: Student</p>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-card">
              <span>📚</span>
              <h3>Enrolled Courses</h3>
              <h2>3</h2>
              <p>Active courses</p>
            </div>

            <div className="dashboard-card">
              <span>📊</span>
              <h3>Attendance</h3>
              <h2>92%</h2>
              <p>Overall attendance</p>
            </div>

            <div className="dashboard-card">
              <span>🏆</span>
              <h3>Exam Marks</h3>
              <h2>85/100</h2>
              <p>Latest examination</p>
            </div>
          </div>

          <section className="dashboard-section">
            <h2>My Courses</h2>
            <div className="dashboard-list">
              <p>📘 Mathematics <span>In Progress</span></p>
              <p>🔬 Science <span>In Progress</span></p>
              <p>💻 Computer Studies <span>In Progress</span></p>
            </div>
          </section>
        </main>

        <footer>
          <h2>🎓 Ace Academy</h2>
          <p>Learn today. Lead tomorrow.</p>
          <p>© 2026 Ace Academy. All rights reserved.</p>
        </footer>
      </div>
    );
  }

  // LOGIN PAGE
  if (showLogin) {
    return (
      <div className="login-page">
        <nav className="navbar login-navbar">
          <h2 onClick={goHome} className="brand-click">
            🎓 Ace Academy
          </h2>
          <button className="login-btn" onClick={goHome}>
            Back to Home
          </button>
        </nav>

        <main className="login-container">
          <div className="login-card">
            <div className="login-icon">🎓</div>

            <p className="tagline">WELCOME BACK</p>
            <h1>Login to Ace Academy</h1>
            <p className="login-subtitle">
              Access your learning and management dashboard.
            </p>

            <div className="role-selector">
              <button
                type="button"
                className={role === "Student" ? "role-btn active" : "role-btn"}
                onClick={() => {
                  setRole("Student");
                  setMessage("");
                }}
              >
                🎒 Student
              </button>

              <button
                type="button"
                className={
                  role === "Admin/Teacher"
                    ? "role-btn active"
                    : "role-btn"
                }
                onClick={() => {
                  setRole("Admin/Teacher");
                  setMessage("");
                }}
              >
                👩‍🏫 Admin/Teacher
              </button>
            </div>

            <form onSubmit={handleLogin}>
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />

              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />

              <button className="submit-login" type="submit">
                Login as {role} →
              </button>
            </form>

            {message && (
              <p className="login-message" role="status">
                {message}
              </p>
            )}

            <p className="login-note">
              New to Ace Academy? Contact your academy administrator for
              account access.
            </p>
          </div>
        </main>

        <footer className="login-footer">
          © 2026 Ace Academy. All rights reserved.
        </footer>
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
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>

        <button className="login-btn" onClick={openLogin}>
          Login
        </button>
      </nav>

      <section className="hero" id="home">
        <div className="hero-content">
          <p className="tagline">WELCOME TO ACE ACADEMY</p>
          <h1>
            Your Success Starts <span>Here.</span>
          </h1>
          <p>
            Learn from expert teachers, track your progress, and achieve
            your academic goals with Ace Academy.
          </p>

          <a className="primary-btn" href="#courses">
            Explore Courses →
          </a>

          <div className="stats">
            <div>
              <h3>500+</h3>
              <p>Students</p>
            </div>
            <div>
              <h3>20+</h3>
              <p>Expert Teachers</p>
            </div>
            <div>
              <h3>95%</h3>
              <p>Success Rate</p>
            </div>
          </div>
        </div>

        <div className="hero-card">
          <div className="cap">🎓</div>
          <h2>Learn. Grow. Succeed.</h2>
          <p>Your journey to excellence begins today.</p>

          <div className="progress">
            <span>Student Progress</span>
            <strong>85%</strong>
            <div className="progress-bar">
              <div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="courses" id="courses">
        <p className="tagline">WHAT WE OFFER</p>
        <h2>Explore Our Courses</h2>
        <p className="section-desc">
          Quality education and personal guidance for every student.
        </p>

        <div className="course-grid">
          <div className="course-card">
            <div className="course-icon">📘</div>
            <h3>Mathematics</h3>
            <p>Build strong concepts and problem-solving skills.</p>
          </div>

          <div className="course-card">
            <div className="course-icon">🔬</div>
            <h3>Science</h3>
            <p>Understand the world through practical learning.</p>
          </div>

          <div className="course-card">
            <div className="course-icon">💻</div>
            <h3>Computer Studies</h3>
            <p>Develop digital skills for your bright future.</p>
          </div>
        </div>
      </section>

      <section className="about" id="about">
        <h2>Education That Empowers You</h2>
        <p>
          At Ace Academy, we help students learn with confidence, monitor
          academic progress, and reach their full potential.
        </p>
      </section>

      <footer id="contact">
        <h2>🎓 Ace Academy</h2>
        <p>Learn today. Lead tomorrow.</p>
        <p>© 2026 Ace Academy. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;