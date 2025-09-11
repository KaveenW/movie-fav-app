import { NavLink, useNavigate } from "react-router-dom";
import { FaFilm, FaHeart, FaMoon, FaSun, FaUser } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { useUser } from "../context/UserContext";

function Navbar() {
  const [scrolled, setScrolled] = useState(false); // Track scroll for styling
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark"); // Light/dark mode
  const [dropdownOpen, setDropdownOpen] = useState(false); // Profile dropdown toggle
  const { user, setUser } = useUser(); // Get current user from context
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Apply theme to body and save preference
  useEffect(() => {
    if (theme === "dark") document.body.classList.add("dark");
    else document.body.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Track page scroll to apply navbar style
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout user and navigate to login
  const handleLogout = async () => {
    await signOut(auth);
    setDropdownOpen(false);
    navigate("/login");
  };

  // Refresh home page when logo clicked
  const handleLogoClick = () => {
    navigate("/");
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <header className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
      {/* Brand logo */}
      <div
        className="brand"
        onClick={handleLogoClick}
        style={{ cursor: "pointer" }}
      >
        <FaFilm />
        <span className="brand-text">CineMax</span>
      </div>

      <nav>
        {!user ? (
          // Show login button if not logged in
          <NavLink to="/login" className="btn-netflix">
            Sign In
          </NavLink>
        ) : (
          <>
            {/* Favorites link */}
            <NavLink
              to="/favorites"
              end
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FaHeart /> Favorites
            </NavLink>

            {/* Profile dropdown */}
            <div className="profile-dropdown" ref={dropdownRef}>
              <button
                className="profile-btn"
                onClick={() => setDropdownOpen((prev) => !prev)}
                title="Profile"
              >
                <FaUser />
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu">
                  <p className="user-email">{user?.email}</p>
                  <button className="logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Theme toggle button */}
        <button
          className="theme-toggle"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <FaSun /> : <FaMoon />}
        </button>
      </nav>
    </header>
  );
}

export default Navbar;
