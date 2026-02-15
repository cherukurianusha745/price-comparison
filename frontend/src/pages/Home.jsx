import { useNavigate } from "react-router-dom";
import "./Auth.css";
import Navbar from "../components/Navbar";

const Home = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.clear();     // remove login data
    navigate("/login");       // go back to login page
  };

  return (
    <>
      <Navbar />

      <div className="auth-container">
        <div className="auth-box" style={{ textAlign: "center" }}>
          <h2>Welcome {username}</h2>
          <p>You have successfully logged in.</p>

          
        </div>
      </div>
    </>
  );
};

export default Home;