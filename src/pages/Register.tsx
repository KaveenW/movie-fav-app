import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Film } from "lucide-react";
import { register } from "../api/auth";
import { useUser } from "../context/UserContext";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const navigate = useNavigate();
  const { user, setUser } = useUser();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) newErrors.name = "Full name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (!confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    if (password && confirmPassword && password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const newUser = await register(email, password, name);
      if (newUser) {
        setUser(newUser);
        navigate("/", { state: { message: `Welcome to CinemaHub, ${name}!` } });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ general: "Registration failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <Film className="auth-logo" />
          <h1 className="auth-appname">CineMax</h1>
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join CineMax to build your collection</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Full Name */}
          <label>Full Name</label>
          {errors.name && <p className="error">{errors.name}</p>}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            disabled={isLoading}
          />

          {/* Email */}
          <label>Email</label>
          {errors.email && <p className="error">{errors.email}</p>}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={isLoading}
          />

          {/* Password */}
          <label>Password</label>
          {errors.password && <p className="error">{errors.password}</p>}
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="toggle-password"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Confirm Password */}
          <label>Confirm Password</label>
          {errors.confirmPassword && (
            <p className="error">{errors.confirmPassword}</p>
          )}
          <div className="password-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="toggle-password"
              disabled={isLoading}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* General error */}
          {errors.general && <p className="error">{errors.general}</p>}

          <button type="submit" disabled={isLoading} className="auth-btn">
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
        <p className="auth-back">
          <Link to="/">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
