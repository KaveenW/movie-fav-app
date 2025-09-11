import { FaFilm } from "react-icons/fa";
import "./App.css";

function App() {
  return (
    <div className="App">
      {/* CineMax Logo */}
      <div className="app-logo">
        <FaFilm size={40} color="#f39c12" />
        <span className="brand-text">CineMax</span>
      </div>
    </div>
  );
}

export default App;
