import { useEffect, useState } from "react";

function App() {
  // =========================
  // AUTHENTICATION
  // =========================

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [showRegister, setShowRegister] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  // =========================
  // SUBSCRIBERS
  // =========================

  const [subscribers, setSubscribers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingId, setEditingId] = useState(null);

  // =========================
  // EMAIL
  // =========================

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const API_URL = "https://bulk-mail-app-1kpu.onrender.com/api/subscribers";
  const EMAIL_API = "https://bulk-mail-app-1kpu.onrender.com/api/email/send";

  // =========================
  // LOGIN
  // =========================

  const loginUser = async (e) => {
    e.preventDefault();

    if (!loginEmail || !loginPassword) {
      alert("Please enter email and password");
      return;
    }

    try {
      const response = await fetch(
        "https://bulk-mail-app-1kpu.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: loginEmail,
            password: loginPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      setIsLoggedIn(true);

      setLoginEmail("");
      setLoginPassword("");

      alert("Login successful!");
    } catch (error) {
      console.error(error);
      alert("Server error during login");
    }
  };

  // =========================
  // REGISTER
  // =========================

  const registerUser = async (e) => {
    e.preventDefault();

    if (!registerName || !registerEmail || !registerPassword) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch(
        "https://bulk-mail-app-1kpu.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: registerName,
            email: registerEmail,
            password: registerPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      alert("Registration successful! Please login.");

      setShowRegister(false);
      setRegisterName("");
      setRegisterEmail("");
      setRegisterPassword("");
    } catch (error) {
      console.error(error);
      alert("Server error during registration");
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const logoutUser = () => {
    localStorage.removeItem("token");

    setIsLoggedIn(false);
    setSubscribers([]);
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setEditingId(null);

    alert("Logged out successfully");
  };

  // =========================
  // GET SUBSCRIBERS
  // =========================

  const fetchSubscribers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        return;
      }

      setSubscribers(data);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
    }
  };
  useEffect(() => {
    if (isLoggedIn) {
      fetchSubscribers();
    }
  }, [isLoggedIn]);

  // =========================
  // ADD / UPDATE SUBSCRIBER
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    if (!name || !email) {
      alert("Please enter name and email");
      return;
    }
   
    try {
      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      alert(
        editingId
          ? "Subscriber updated successfully"
          : "Subscriber added successfully"
      );

      setName("");
      setEmail("");
      setEditingId(null);

      fetchSubscribers();
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  // =========================
  // DELETE
  // =========================

  const deleteSubscriber = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Subscriber data:", data);
      if (!response.ok) {
        alert(data.message || "Delete failed");
        return;
      }

      alert("Subscriber deleted successfully");

      fetchSubscribers();
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  // =========================
  // EDIT
  // =========================

  const editSubscriber = (subscriber) => {
    setName(subscriber.name);
    setEmail(subscriber.email);
    setEditingId(subscriber._id);

    window.scrollTo({
      top: 300,
      behavior: "smooth",
    });
  };

  // =========================
  // SEND EMAIL
  // =========================

  const sendEmail = async (e) => {
    e.preventDefault();
    if (sending) {
      return;
    }

    if (!subject || !message) {
      alert("Please enter subject and message");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      setSending(true);

      const response = await fetch(EMAIL_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject,
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to send email");
        return;
      }

      setSuccessMessage(data.message);

      setSubject("");
      setMessage("");

      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (error) {
      console.error(error);
      alert("Server error while sending email");
    } finally {
      setSending(false);
    }
  };
  // =========================
  // LOGIN / REGISTER
  // =========================

  if (!isLoggedIn) {
    return (
      <div style={styles.authPage}>
        <div style={styles.authCard}>

          <div style={styles.authLogo}>
            ✉
          </div>

          <h1 style={styles.authTitle}>
            <span style={styles.highlight}>
              Bulk Mail
            </span>
          </h1>

          <p style={styles.subtitle}>
            Send emails to all your subscribers easily
          </p>

          {!showRegister ? (
            <>
              <h2 style={styles.formTitle}>
                Welcome Back
              </h2>

              <form onSubmit={loginUser}>

                <input
                  style={styles.input}
                  type="email"
                  placeholder="Email address"
                  value={loginEmail}
                  onChange={(e) =>
                    setLoginEmail(e.target.value)
                  }
                />

                <input
                  style={styles.input}
                  type="password"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) =>
                    setLoginPassword(e.target.value)
                  }
                />

                <button
                  style={styles.primaryButton}
                  type="submit"
                >
                  Login
                </button>

              </form>

              <p style={styles.switchText}>
                Don't have an account?
              </p>

              <button
                style={styles.secondaryButton}
                onClick={() => setShowRegister(true)}
              >
                Create Account
              </button>
            </>
          ) : (
            <>
              <h2 style={styles.formTitle}>
                Create Account
              </h2>

              <form onSubmit={registerUser}>

                <input
                  style={styles.input}
                  type="text"
                  placeholder="Full name"
                  value={registerName}
                  onChange={(e) =>
                    setRegisterName(e.target.value)
                  }
                />

                <input
                  style={styles.input}
                  type="email"
                  placeholder="Email address"
                  value={registerEmail}
                  onChange={(e) =>
                    setRegisterEmail(e.target.value)
                  }
                />

                <input
                  style={styles.input}
                  type="password"
                  placeholder="Password"
                  value={registerPassword}
                  onChange={(e) =>
                    setRegisterPassword(e.target.value)
                  }
                />

                <button
                  style={styles.primaryButton}
                  type="submit"
                >
                  Register
                </button>

              </form>

              <button
                style={styles.secondaryButton}
                onClick={() => setShowRegister(false)}
              >
                Back to Login
              </button>
            </>
          )}

        </div>
      </div>
    );
  }

  // =========================
  // MAIN DASHBOARD
  // =========================

  return (
    <div style={styles.page}>

      {/* HEADER */}

      <header style={styles.header}>

        <div style={styles.brandArea}>

          <div style={styles.mailLogo}>
            ✉
          </div>

          <div>
            <h1 style={styles.title}>
              <span style={styles.highlight}>
                Bulk Mail
              </span>
            </h1>

            <p style={styles.headerSubtitle}>
              Manage subscribers and send bulk emails
            </p>
          </div>

        </div>

        <button
          style={styles.logoutButton}
          onClick={logoutUser}
        >
          Logout
        </button>

      </header>

      {/* MAIN CONTAINER */}

      <main style={styles.container}>

        {/* =========================
            STATS
        ========================= */}

        <div style={styles.statsGrid}>

          {/* SUBSCRIBERS */}

          <div style={styles.subscriberStatCard}>

            <div style={styles.statCircleBlue}>
              👥
            </div>

            <div style={styles.statContent}>

              <p style={styles.statLabel}>
                Subscribers
              </p>

              <h2 style={styles.subscriberNumber}>
                {subscribers.length}
              </h2>

              <span style={styles.statBadgeBlue}>
                ↑ Total subscribers
              </span>

            </div>

            <div style={styles.backgroundIcon}>
              👥
            </div>

          </div>

          {/* EMAIL STATUS */}

          <div style={styles.emailStatCard}>

            <div style={styles.statCircleGreen}>
              ✉
            </div>

            <div style={styles.statContent}>

              <p style={styles.emailStatLabel}>
                Email Status
              </p>

              <h2 style={styles.readyNumber}>
                Ready
              </h2>

              <span style={styles.statBadgeGreen}>
                ✓ System active
              </span>

            </div>

            <div style={styles.backgroundSendIcon}>
              ➤
            </div>

          </div>

        </div>

        {/* =========================
            ADD SUBSCRIBER
        ========================= */}

        <section style={styles.card}>

          <div style={styles.sectionHeading}>

            <div style={styles.sectionIconBlue}>
              👤
            </div>

            <div>

              <h2 style={styles.boldHeading}>
                {editingId
                  ? "Edit Subscriber"
                  : "Add Subscriber"}
              </h2>

              <p style={styles.smallDescription}>
                Add a new subscriber to your mailing list
              </p>

            </div>

          </div>

          <form onSubmit={handleSubmit}>

            <div style={styles.addFormGrid}>

              <div>
                <label style={styles.inputLabel}>
                  Subscriber name
                </label>

                <input
                  style={styles.modernInput}
                  type="text"
                  placeholder="Enter subscriber name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                />
              </div>

              <div>
                <label style={styles.inputLabel}>
                  Subscriber email
                </label>

                <input
                  style={styles.modernInput}
                  type="email"
                  placeholder="Enter subscriber email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />
              </div>

              <button
                style={styles.addButton}
                type="submit"
              >
                {editingId
                  ? "✓ Update Subscriber"
                  : "+ Add Subscriber"}
              </button>

            </div>

            {editingId && (
              <button
                style={styles.cancelButton}
                type="button"
                onClick={() => {
                  setName("");
                  setEmail("");
                  setEditingId(null);
                }}
              >
                Cancel
              </button>
            )}

          </form>

        </section>

        {/* =========================
            SUBSCRIBER LIST
        ========================= */}

        <section style={styles.card}>

          <div style={styles.sectionHeader}>

            <div style={styles.sectionHeadingSmall}>

              <div style={styles.sectionIconBlue}>
                👥
              </div>

              <h2 style={styles.boldHeading}>
                Subscribers
              </h2>

            </div>

            <span style={styles.totalBadge}>
              {subscribers.length} Total
            </span>

          </div>

          {subscribers.length === 0 ? (

            <div style={styles.emptyState}>

              <div style={styles.emptyIcon}>
                👥
              </div>

              <h3>
                No subscribers yet
              </h3>

              <p>
                Add your first subscriber above.
              </p>

            </div>

          ) : (

            <div style={styles.tableWrapper}>

              <table style={styles.table}>

                <thead>

                  <tr>

                    <th style={styles.th}>
                      #
                    </th>

                    <th style={styles.th}>
                      Name
                    </th>

                    <th style={styles.th}>
                      Email
                    </th>

                    <th style={styles.th}>
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {subscribers.map(
                    (subscriber, index) => (

                      <tr
                        key={subscriber._id}
                        style={styles.tableRow}
                      >

                        <td style={styles.numberCell}>
                          {index + 1}
                        </td>

                        <td style={styles.nameCell}>
                          {subscriber.name}
                        </td>

                        <td style={styles.emailCell}>
                          {subscriber.email}
                        </td>

                        <td style={styles.td}>

                          <button
                            style={styles.editButton}
                            onClick={() => editSubscriber(subscriber)}
                          >
                            ✎ Edit
                          </button>

                          <button
                            style={styles.deleteButton}
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Are you sure you want to delete ${subscriber.name}?`
                                )
                              ) {
                                deleteSubscriber(subscriber._id);
                              }
                            }}
                          >
                            🗑 Delete
                          </button>
                        </td>

                      </tr>

                    ))}

                </tbody>

              </table>

            </div>

          )}

        </section>

        {/* =========================
            SEND BULK EMAIL
        ========================= */}

        <section style={styles.emailCard}>

          <div style={styles.emailHeading}>

            <div style={styles.emailIcon}>
              📤
            </div>

            <div>

              <h2 style={styles.sendBulkTitle}>
                Send Bulk Email
              </h2>

              <p style={styles.emailDescription}>
                Send an email to all{" "}
                <strong>
                  {subscribers.length}
                </strong>{" "}
                subscribers
              </p>

            </div>

          </div>
          {successMessage && (
            <div style={styles.successMessage}>
              ✓ {successMessage}
            </div>
          )}
          <form onSubmit={sendEmail}>

            <input
              style={styles.emailInput}
              type="text"
              placeholder="Email subject"
              value={subject}
              onChange={(e) =>
                setSubject(e.target.value)
              }
            />

            <textarea
              style={styles.emailTextarea}
              placeholder="Write your email message..."
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              rows="7"
            />

            <button
              style={
                subscribers.length === 0 || sending
                  ? styles.sendButtonDisabled
                  : styles.sendButton
              }
              type="submit"
              disabled={subscribers.length === 0 || sending}
            >
              {sending
                ? "📤 Sending..."
                : "📤 Send Email to All Subscribers"}
            </button>
            <button
              type="button"
              style={styles.clearButton}
              onClick={() => {
                setSubject("");
                setMessage("");
              }}
            >
              Clear
            </button>
          </form>

        </section>

      </main>

    </div>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = {

  // =========================
  // LOGIN
  // =========================

  authPage: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(135deg, #eef2ff, #f8fafc)",
    padding: "20px",
  },

  authCard: {
    width: "100%",
    maxWidth: "420px",
    background: "white",
    padding: "40px",
    borderRadius: "20px",
    boxShadow:
      "0 15px 45px rgba(0,0,0,0.10)",
    textAlign: "center",
  },

  authLogo: {
    width: "70px",
    height: "70px",
    margin: "0 auto 15px",
    borderRadius: "20px",
    background:
      "linear-gradient(135deg, #4f46e5, #7c3aed)",
    color: "white",
    fontSize: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  authTitle: {
    margin: "0",
    fontSize: "32px",
  },

  highlight: {
    color: "#4f46e5",
    background: "#eef2ff",
    padding: "5px 12px",
    borderRadius: "10px",
    fontWeight: "800",
  },

  subtitle: {
    color: "#64748b",
    marginBottom: "30px",
  },

  formTitle: {
    marginBottom: "20px",
    color: "#111827",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px",
    marginBottom: "14px",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    fontSize: "15px",
    outline: "none",
  },

  primaryButton: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    background:
      "linear-gradient(135deg, #4f46e5, #7c3aed)",
    color: "white",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
  },

  secondaryButton: {
    padding: "11px 20px",
    border: "1px solid #6366f1",
    borderRadius: "9px",
    background: "white",
    color: "#4f46e5",
    fontSize: "15px",
    cursor: "pointer",
    fontWeight: "600",
  },

  switchText: {
    color: "#64748b",
    marginTop: "25px",
    marginBottom: "10px",
  },

  // =========================
  // PAGE
  // =========================

  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    color: "#111827",
  },

  // =========================
  // HEADER
  // =========================

  header: {
    background: "white",
    padding: "20px 5%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow:
      "0 2px 12px rgba(0,0,0,0.06)",
  },

  brandArea: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  mailLogo: {
    width: "55px",
    height: "55px",
    borderRadius: "14px",
    background:
      "linear-gradient(135deg, #4f46e5, #7c3aed)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
  },

  title: {
    margin: "0",
    fontSize: "30px",
    fontWeight: "800",
  },

  headerSubtitle: {
    margin: "6px 0 0",
    color: "#64748b",
    fontSize: "14px",
  },

  logoutButton: {
    padding: "11px 20px",
    border: "none",
    borderRadius: "9px",
    background: "#ef4444",
    color: "white",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
  },

  // =========================
  // CONTAINER
  // =========================

  container: {
    maxWidth: "1200px",
    margin: "30px auto",
    padding: "0 20px",
  },

  // =========================
  // STATS
  // =========================

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "22px",
    marginBottom: "22px",
  },

  subscriberStatCard: {
    position: "relative",
    overflow: "hidden",
    background:
      "linear-gradient(135deg, #eff6ff, #dbeafe)",
    border: "1px solid #bfdbfe",
    borderLeft: "6px solid #2563eb",
    padding: "26px 30px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    minHeight: "125px",
    boxShadow:
      "0 5px 20px rgba(37,99,235,0.08)",
  },

  emailStatCard: {
    position: "relative",
    overflow: "hidden",
    background:
      "linear-gradient(135deg, #f0fdf4, #dcfce7)",
    border: "1px solid #bbf7d0",
    borderLeft: "6px solid #16a34a",
    padding: "26px 30px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    minHeight: "125px",
    boxShadow:
      "0 5px 20px rgba(22,163,74,0.08)",
  },

  statCircleBlue: {
    width: "75px",
    height: "75px",
    borderRadius: "50%",
    background: "#2563eb",
    color: "white",
    fontSize: "32px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },

  statCircleGreen: {
    width: "75px",
    height: "75px",
    borderRadius: "50%",
    background: "#16a34a",
    color: "white",
    fontSize: "32px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },

  statContent: {
    position: "relative",
    zIndex: 2,
  },

  statLabel: {
    margin: "0",
    fontSize: "16px",
    fontWeight: "700",
    color: "#475569",
  },

  emailStatLabel: {
    margin: "0",
    fontSize: "16px",
    fontWeight: "700",
    color: "#15803d",
  },

  subscriberNumber: {
    margin: "3px 0 6px",
    fontSize: "40px",
    fontWeight: "800",
    color: "#2563eb",
  },

  readyNumber: {
    margin: "3px 0 6px",
    fontSize: "36px",
    fontWeight: "800",
    color: "#16a34a",
  },

  statBadgeBlue: {
    display: "inline-block",
    background: "#dbeafe",
    color: "#2563eb",
    padding: "5px 11px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
  },

  statBadgeGreen: {
    display: "inline-block",
    background: "#bbf7d0",
    color: "#15803d",
    padding: "5px 11px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
  },

  backgroundIcon: {
    position: "absolute",
    right: "15px",
    bottom: "-25px",
    fontSize: "110px",
    opacity: "0.06",
  },

  backgroundSendIcon: {
    position: "absolute",
    right: "25px",
    top: "15px",
    fontSize: "85px",
    color: "#16a34a",
    opacity: "0.10",
  },

  // =========================
  // CARDS
  // =========================

  card: {
    background: "white",
    padding: "28px",
    borderRadius: "16px",
    marginBottom: "22px",
    boxShadow:
      "0 4px 18px rgba(0,0,0,0.06)",
    border: "1px solid #e5e7eb",
  },

  // =========================
  // SECTION HEADINGS
  // =========================

  sectionHeading: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "25px",
  },

  sectionHeadingSmall: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  sectionIconBlue: {
    width: "48px",
    height: "48px",
    borderRadius: "13px",
    background: "#eef2ff",
    color: "#4f46e5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
  },

  boldHeading: {
    margin: "0",
    fontSize: "22px",
    fontWeight: "800",
    color: "#111827",
  },

  smallDescription: {
    margin: "4px 0 0",
    color: "#64748b",
    fontSize: "14px",
  },

  // =========================
  // ADD SUBSCRIBER
  // =========================

  addFormGrid: {
    display: "grid",
    gridTemplateColumns:
      "1fr 1fr 190px",
    gap: "16px",
    alignItems: "end",
  },

  inputLabel: {
    display: "block",
    fontSize: "14px",
    fontWeight: "700",
    color: "#334155",
    marginBottom: "8px",
  },

  modernInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 16px",
    border: "1.5px solid #cbd5e1",
    borderRadius: "10px",
    fontSize: "15px",
    color: "#334155",
    background: "#ffffff",
    outline: "none",
  },

  addButton: {
    height: "48px",
    border: "none",
    borderRadius: "10px",
    background:
      "linear-gradient(135deg, #4f46e5, #7c3aed)",
    color: "white",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow:
      "0 5px 12px rgba(79,70,229,0.25)",
  },

  cancelButton: {
    marginTop: "15px",
    padding: "10px 18px",
    border: "none",
    borderRadius: "8px",
    background: "#64748b",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
  },

  // =========================
  // SUBSCRIBER TABLE
  // =========================

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  totalBadge: {
    background: "#eef2ff",
    color: "#4f46e5",
    padding: "7px 14px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "700",
  },

  tableWrapper: {
    overflowX: "auto",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "15px",
    background: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
    color: "#475569",
    fontSize: "14px",
    fontWeight: "800",
  },

  td: {
    padding: "15px",
    borderBottom: "1px solid #e5e7eb",
  },

  tableRow: {
    background: "white",
  },

  numberCell: {
    padding: "15px",
    borderBottom: "1px solid #e5e7eb",
    color: "#94a3b8",
    fontWeight: "600",
  },

  nameCell: {
    padding: "15px",
    borderBottom: "1px solid #e5e7eb",
    color: "#4338ca",
    fontSize: "15px",
    fontWeight: "700",
  },

  emailCell: {
    padding: "15px",
    borderBottom: "1px solid #e5e7eb",
    color: "#64748b",
    fontSize: "15px",
    fontWeight: "500",
  },

  editButton: {
    padding: "8px 13px",
    marginRight: "8px",
    border: "none",
    borderRadius: "7px",
    background: "#f59e0b",
    color: "white",
    cursor: "pointer",
    fontWeight: "700",
  },

  deleteButton: {
    padding: "8px 13px",
    border: "none",
    borderRadius: "7px",
    background: "#ef4444",
    color: "white",
    cursor: "pointer",
    fontWeight: "700",
  },

  emptyState: {
    textAlign: "center",
    padding: "40px",
    color: "#64748b",
  },

  emptyIcon: {
    fontSize: "40px",
    marginBottom: "10px",
  },

  // =========================
  // SEND EMAIL
  // =========================

  emailCard: {
    background: "white",
    padding: "28px",
    borderRadius: "16px",
    marginBottom: "30px",
    boxShadow:
      "0 4px 18px rgba(0,0,0,0.06)",
    border: "1px solid #e5e7eb",
  },

  emailHeading: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "25px",
  },

  emailIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "14px",
    background: "#ede9fe",
    color: "#7c3aed",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "25px",
  },

  sendBulkTitle: {
    margin: "0",
    fontSize: "24px",
    fontWeight: "900",
    color: "#111827",
  },

  emailDescription: {
    margin: "5px 0 0",
    color: "#64748b",
    fontSize: "14px",
  },

  emailInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 16px",
    marginBottom: "14px",
    border: "1.5px solid #cbd5e1",
    borderRadius: "10px",
    fontSize: "15px",
    outline: "none",
  },

  emailTextarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 16px",
    marginBottom: "16px",
    border: "1.5px solid #cbd5e1",
    borderRadius: "10px",
    fontSize: "15px",
    resize: "vertical",
    outline: "none",
    fontFamily: "inherit",
  },

  sendButton: {
    width: "100%",
    padding: "15px",
    border: "none",
    borderRadius: "10px",
    background:
      "linear-gradient(135deg, #4f46e5, #7c3aed)",
    color: "white",
    fontSize: "16px",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow:
      "0 5px 14px rgba(79,70,229,0.25)",
  },

  sendButtonDisabled: {
    width: "100%",
    padding: "15px",
    border: "none",
    borderRadius: "10px",
    background: "#cbd5e1",
    color: "#64748b",
    fontSize: "16px",
    fontWeight: "800",
    cursor: "not-allowed",
  },
  successMessage: {
    background: "#ecfdf5",
    border: "1px solid #86efac",
    color: "#15803d",
    padding: "14px 18px",
    borderRadius: "10px",
    marginBottom: "18px",
    fontSize: "15px",
    fontWeight: "700",
  },
  clearButton: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    background: "white",
    color: "#475569",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
  },
};

export default App;