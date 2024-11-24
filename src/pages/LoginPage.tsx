import React from "react";
import LoginForm from "../components/auth/LoginForm";

const LoginPage: React.FC = () => {
  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
