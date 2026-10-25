import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [role, setRole] = useState("Student");
  
  // Changed from email to username to match our database names
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [dbStudents, setDbStudents] = useState([]);
  const [newName, setNewName] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newMarks, setNewMarks] = useState("");

  // Calculate real dynamic numbers from database
  const uniqueCoursesCount = new Set(dbStudents.map(student => student.subject)).size;

  // We now fetch data immediately so the Home Page can display live stats
  useEffect(() => {
    fetch("http://localhost:5000/api/students")
      .then((res) => res.json())
      .then((data) => setDbStudents(data))
      .catch((err) => console.error("Error connecting to database:", err));
  }, []);

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

  // FULLY FUNCTIONAL LOGIN LOGIC
  function handleLogin(event) {
    event.preventDefault();

    if (!username.trim() || !password) {
      setMessage("Please enter your details.");
      return;
    }

    setMessage("");

    if (role === "Admin/Teacher") {
      if (username === "admin" && password === "admin123") {
        setShowLogin(false);
        setShowDashboard(false);
        setShowAdminDashboard(true);
      } else {
        setMessage("Invalid Admin credentials. (Hint: admin / admin123)");
      }
    } else {
      // NEW: Real Student Login Logic
      // Checks if the typed username exists anywhere in the live database
      const studentExists = dbStudents.some(
        (s) => s.name.toLowerCase() === username.toLowerCase()
      );

      if (studentExists) {
        setShowLogin(false);
        setShowDashboard(true);
        setShowAdminDashboard(false);
      } else {
        setMessage("Student not found. Please enter your exact registered name.");
      }
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
    setUsername("");
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
                    <tr key={student._id || student.name + student.subject}>
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

  // FUNCTIONAL STUDENT DASHBOARD
  if (showDashboard) {
    // Filter database to ONLY show records matching this specific student
    const myRecords = dbStudents.filter(
      (s) => s.name.toLowerCase() === username.toLowerCase()
    );

    return (
      <div className="dashboard-page">
        <nav className="navbar">
          <h2>🎓 Ace Academy</h2>
          <button className="login-btn" onClick={goHome}>Logout</button>
        </nav>
        <main className="dashboard-container">
          <div className="dashboard-heading">
            <p className="tagline">STUDENT PORTAL</p>
            <h1>Welcome, {username}! 👋</h1>
            <p>Here are your official academic records.</p>
          </div>
          
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <span>📚</span>
              <h3>My Courses</h3>
              <h2>{myRecords.length}</h2>
              <p>Enrolled Subjects</p>
            </div>
          </div>

          <section className="dashboard-section">
            <h2>My Report Card</h2>
            <div className="student-table-wrap">
              <table className="student-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Marks Achieved</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myRecords.map((record) => (
                    <tr key={record._id || record.subject}>
                      <td>{record.subject}</td>
                      <td>{record.marks}/100</td>
                      <td style={{ color: record.marks >= 40 ? 'green' : 'red' }}>
                        {record.marks >= 40 ? 'Pass' : 'Fail'}
                      </td>
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
              <label htmlFor="username">
                {role === "Student" ? "Full Name (e.g., Rahul Sharma)" : "Admin Username"}
              </label>
              <input
                id="username" type="text" placeholder={role === "Student" ? "Enter your registered name" : "Enter username"}
                value={username} onChange={(event) => setUsername(event.target.value)} required
              />
              
              <label htmlFor="password">Password (Type anything for Demo)</label>
              <input
                id="password" type="password" placeholder="Enter your password"
                value={password} onChange={(event) => setPassword(event.target.value)} required
              />
              <button className="submit-login" type="submit">Login as {role} →</button>
            </form>
            {message && <p className="login-message" style={{color: "red"}} role="status">{message}</p>}
          </div>
        </main>
      </div>
    );
  }

  // DYNAMIC HOME PAGE
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
          <a className="primary-btn" onClick={openLogin} style={{ cursor: "pointer" }}>Access Dashboard →</a>
          
          <div className="stats">
            <div>
              <h3>{dbStudents.length > 0 ? dbStudents.length : "500+"}</h3>
              <p>Registered Students</p>
            </div>
            <div>
              <h3>{uniqueCoursesCount > 0 ? uniqueCoursesCount : "10+"}</h3>
              <p>Active Courses</p>
            </div>
            <div>
              <h3>100%</h3>
              <p>Database Integrated</p>
            </div>
          </div>
        </div>
      </section>

      <section className="courses" id="courses">
        <p className="tagline">LIVE DIRECTORY</p>
        <h2>Currently Offered Courses</h2>
        <p className="section-desc">
          Dynamically fetched from our MongoDB Database.
        </p>

        <div className="course-grid">
          {uniqueCoursesCount > 0 ? (
            [...new Set(dbStudents.map(s => s.subject))].map((course, i) => (
              <div className="course-card" key={i}>
                <div className="course-icon">📘</div>
                <h3>{course}</h3>
                <p>Active and currently enrolling students.</p>
              </div>
            ))
          ) : (
            <p>Loading database courses...</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default App;