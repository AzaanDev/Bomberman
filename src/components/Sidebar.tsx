import "../App.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import SignupModal from "./Modals/SignupModal";
import LoginModal from "./Modals/LoginModal";
import { clearCredentials } from "../store/reducers/AuthSlice";

const Sidebar = () => {
  const dispatch = useDispatch();

  const [showSignupModal, setSignupModal] = useState(false);
  const [showLoginModal, setLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const openSignupModal = () => setSignupModal(true);
  const closeSignupModal = () => setSignupModal(false);

  const openLoginModal = () => setLoginModal(true);
  const closeLoginModal = () => setLoginModal(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    dispatch(clearCredentials);
  };

  const handleLoggedIn = (loggedIn: boolean) => {
    setIsLoggedIn(loggedIn);
  };

  return (
    <div className="sidebar-container">
      <h2 className="sidebar-header">Bomberman</h2>
      <nav className="sidebar">
        <div>Play</div>
        <div>Friends</div>
        <div>Leaderboard</div>
        {isLoggedIn ? (
          <div onClick={handleLogout}>Logout</div>
        ) : (
          <>
            <div onClick={openSignupModal}>Signup</div>
            <div onClick={openLoginModal}>Login</div>
          </>
        )}
      </nav>

      {showSignupModal && <SignupModal closeModal={closeSignupModal} />}
      {showLoginModal && (
        <LoginModal closeModal={closeLoginModal} setLoggedIn={handleLoggedIn} />
      )}
    </div>
  );
};

export default Sidebar;
