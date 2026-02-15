import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Auth.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "viewer",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear field-specific error when user starts typing
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
    }
    // Clear general error
    setError("");
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setFieldErrors({});
    setLoading(true);

    // Client-side validation
    const errors = {};

    if (!formData.username.trim()) {
      errors.username = "Username is required";
    } else if (formData.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const payload = {
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(), // Normalize email to lowercase
        password: formData.password,
        password2: formData.confirmPassword,
        role: formData.role,
      };

      console.log("Register payload:", payload);
      
      const res = await API.post("register/", payload);
      console.log("Register response:", res.data);
      
      setMessage(res.data.message || "Registration successful! Redirecting to login...");
      
      // Clear form
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "viewer",
      });
      
      // Redirect to login after successful registration
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
    } catch (err) {
      console.error("Registration error:", err);
      console.error("Error response:", err.response);
      
      if (err.response && err.response.data) {
        const data = err.response.data;
        const fieldErrors = {};
        
        // Handle specific field errors from backend
        if (data.username) {
          fieldErrors.username = Array.isArray(data.username) 
            ? data.username[0] 
            : data.username;
        }
        
        if (data.email) {
          fieldErrors.email = Array.isArray(data.email) 
            ? data.email[0] 
            : data.email;
        }
        
        if (data.password) {
          fieldErrors.password = Array.isArray(data.password) 
            ? data.password[0] 
            : data.password;
        }
        
        if (Object.keys(fieldErrors).length > 0) {
          setFieldErrors(fieldErrors);
          
          // Check if email already exists
          if (fieldErrors.email && fieldErrors.email.includes("already exists")) {
            setError("This email is already registered. Please use a different email or try logging in.");
          } else {
            setError("Please correct the errors below.");
          }
        } else if (data.non_field_errors) {
          // Handle non-field errors
          setError(Array.isArray(data.non_field_errors) 
            ? data.non_field_errors[0] 
            : data.non_field_errors);
        } else if (typeof data === 'string') {
          setError(data);
        } else {
          setError("Registration failed. Please check your information and try again.");
        }
      } else if (err.request) {
        // Request was made but no response received
        setError("Cannot connect to server. Please check if the backend is running.");
      } else {
        // Something else happened
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-box" onSubmit={handleSubmit} noValidate>
        <h2>Register</h2>

        <div className="form-group">
          <input
            type="text"
            name="username"
            placeholder="Username"
            required
            onChange={handleChange}
            value={formData.username}
            disabled={loading}
            className={fieldErrors.username ? "error-input" : ""}
          />
          {fieldErrors.username && (
            <small className="field-error">{fieldErrors.username}</small>
          )}
        </div>

        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
            value={formData.email}
            disabled={loading}
            className={fieldErrors.email ? "error-input" : ""}
          />
          {fieldErrors.email && (
            <small className="field-error">{fieldErrors.email}</small>
          )}
        </div>

        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            onChange={handleChange}
            value={formData.password}
            disabled={loading}
            className={fieldErrors.password ? "error-input" : ""}
          />
          {fieldErrors.password && (
            <small className="field-error">{fieldErrors.password}</small>
          )}
        </div>

        <div className="form-group">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
            onChange={handleChange}
            value={formData.confirmPassword}
            disabled={loading}
            className={fieldErrors.confirmPassword ? "error-input" : ""}
          />
          {fieldErrors.confirmPassword && (
            <small className="field-error">{fieldErrors.confirmPassword}</small>
          )}
        </div>

        <div className="form-group">
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}

        <p className="switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;