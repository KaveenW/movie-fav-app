import { NavLink } from "react-router-dom";
import { FaFilm, FaHome, FaHeart } from "react-icons/fa";
import index from "../index.css";

function Navbar() {
  return (
    <header className="nav">
      <div className="brand">
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <FaFilm /> CineMax
        </NavLink>
      </div>
      <nav>
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <FaHome /> Home
        </NavLink>
        <NavLink
          to="/favorites"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <FaHeart /> Favorites
        </NavLink>
      </nav>
    </header>
  );
}

export default Navbar;
