import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import UserManagement from "./pages/UserManagment";

const App: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("accessToken");
    if (
      isAuthenticated === null ||
      isAuthenticated == "" ||
      isAuthenticated === "undefined"
    ) {
      navigate("/login");
    } else {
      navigate("/userManagement");
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/userManagement" element={<UserManagement />} />
      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
};

export default App;
