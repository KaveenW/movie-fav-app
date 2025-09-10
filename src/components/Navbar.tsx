import { NavLink, useNavigate } from "react-router-dom";
import { FaFilm, FaHeart, FaMoon, FaSun, FaUser } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { useUser } from "../context/UserContext";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (theme === "dark") document.body.classList.add("dark");
    else document.body.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
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

  const handleLogout = async () => {
    await signOut(auth);
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <header className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
      <div className="brand">
        <NavLink to="/" end>
          <FaFilm />
          <span className="brand-text">CinemaHub</span>
        </NavLink>
      </div>

      <nav>
        {!user ? (
          <NavLink to="/login" className="btn-netflix">
            Sign In
          </NavLink>
        ) : (
          <>
            <NavLink
              to="/favorites"
              end
              className={({ isActive }) => (isActive ? "active" : "")}
            >
            <FaHeart/> Favorites
            </NavLink>

            {/* Profile Dropdown */}
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
