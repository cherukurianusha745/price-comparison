import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
import API from "../services/api";
import "./Auth.css";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loggedUser = localStorage.getItem("username");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("login/", formData);
      
      console.log("Login response:", res.data);
      
      // Store user data
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("email", res.data.email || '');
      localStorage.setItem("is_admin", res.data.is_admin);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("user_id", res.data.user_id);
      localStorage.setItem("isAuthenticated", "true");

      navigate("/home");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.error || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const googleLogin = useGoogleLogin({
    clientId: '456375997142-16vs1sp1hfate2apnps3v10jjluj370p.apps.googleusercontent.com', // Replace with your actual Google Client ID
    onSuccess: async (tokenResponse) => {
      console.log("✅ Google OAuth Success - Full response:", tokenResponse);
      console.log("✅ Access token:", tokenResponse.access_token);
      
      setLoading(true);
      setError("");
      
      try {
        // Get user info from Google
        console.log("📡 Fetching user info from Google...");
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });
        
        if (!userInfoResponse.ok) {
          const errorText = await userInfoResponse.text();
          console.error("❌ Google user info error:", errorText);
          throw new Error(`Failed to get user info: ${userInfoResponse.status}`);
        }
        
        const googleUserInfo = await userInfoResponse.json();
        console.log("✅ Google user info received:", googleUserInfo);
        
        // Send to backend
        console.log("📡 Sending to backend:", googleUserInfo.email);
        const backendResponse = await API.post('google-login/', {
          email: googleUserInfo.email,
          name: googleUserInfo.name,
          given_name: googleUserInfo.given_name,
          family_name: googleUserInfo.family_name,
          picture: googleUserInfo.picture,
          sub: googleUserInfo.sub
        }, {
          headers: {
            'Content-Type': 'application/json',
          }
        });

        console.log("✅ Backend response:", backendResponse.data);

        // Store user data
        localStorage.setItem("username", backendResponse.data.username);
        localStorage.setItem("email", backendResponse.data.email);
        localStorage.setItem("is_admin", backendResponse.data.is_admin);
        localStorage.setItem("role", backendResponse.data.role);
        localStorage.setItem("user_id", backendResponse.data.user_id);
        localStorage.setItem("isAuthenticated", "true");
        
        console.log("✅ Login complete, redirecting to home");
        navigate("/home");
      } catch (err) {
        console.error('❌ Google login error:', err);
        if (err.response) {
          console.error('Error response data:', err.response.data);
          console.error('Error response status:', err.response.status);
          console.error('Error response headers:', err.response.headers);
          setError(err.response.data?.error || "Google login failed");
        } else if (err.request) {
          console.error('No response received from backend');
          setError("Cannot connect to server. Is backend running?");
        } else {
          console.error('Error message:', err.message);
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error('❌ Google OAuth error:', error);
      setError(`Google login failed: ${error.error_description || error.error || "Please try again"}`);
      setLoading(false);
    },
    flow: 'implicit',
  });

  return (
    <div className="auth-container">
      <form className="auth-box" onSubmit={handleSubmit}>
        <h2>Login</h2>

        {!loggedUser ? (
          <>
            <input 
              type="text" 
              name="username" 
              placeholder="Username" 
              required 
              onChange={handleChange} 
              value={formData.username}
              disabled={loading}
            />
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              required 
              onChange={handleChange} 
              value={formData.password}
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
            
            <div className="divider">
              <span>OR</span>
            </div>
            
            <button 
              type="button" 
              className="google-login-btn"
              onClick={() => googleLogin()}
              disabled={loading}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" style={{marginRight: '10px'}}>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Login with Google
            </button>
          </>
        ) : (
          <>
            <p className="success">Logged in as {loggedUser}</p>
            <button type="button" className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}

        {error && <p className="error">{error}</p>}

        {!loggedUser && (
          <p className="switch">
            New user? <Link to="/register">Register</Link>
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;