import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Film } from "lucide-react";
import { login } from "../api/auth";
import { useUser } from "../context/UserContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const navigate = useNavigate();
  const { user, setUser } = useUser();

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setErrors({});

    // Validate inputs
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = "Please enter your email.";
    if (!password) newErrors.password = "Please enter your password.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const loggedInUser = await login(email, password);
      if (loggedInUser) {
        setUser(loggedInUser);

        navigate("/", {
          state: {
            message: `Welcome back, ${loggedInUser.displayName || "User"}!`,
          },
        });
      } else {
        setErrors({ password: "Invalid email or password." });
      }
    } catch (error) {
      console.error(error);
      setErrors({ password: "Something went wrong. Please try again." });
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
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>Email</label>
          {errors.email && <p className="error-text">{errors.email}</p>}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={isLoading}
          />

          <label>Password</label>
          {errors.password && <p className="error-text">{errors.password}</p>}
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
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

          <button type="submit" disabled={isLoading} className="auth-btn">
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="demo-box">
          <h3>Demo Account</h3>
          <p>Email: demo@cinemax.com</p>
          <p>Password: demo123</p>
        </div>

        <p className="auth-link">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
        <p className="auth-back">
          <Link to="/">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
