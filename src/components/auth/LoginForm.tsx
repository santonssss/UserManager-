import React, { useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        password: password,
        email: email,
      });
      if (data && data.user && data.user.email) {
        sessionStorage.setItem("email", data.user.email);
      }
      if (data.session?.access_token) {
        sessionStorage.setItem("accessToken", data.session.access_token);
        alert("Вы успешно вошли!");
        navigate("/userManagement");
      }
      if (error) {
        setError(error.message);
      }
    } catch (error) {}
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="w-100 mx-auto p-4"
      style={{ maxWidth: "400px" }}
    >
      <h2 className="text-center mb-4">Вход</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="email"
          id="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Пароль
        </label>
        <input
          type="password"
          id="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary w-100">
        Войти
      </button>
      <p className="text-center mt-3">
        Нет аккаунта? <a href="/register">Зарегистрируйтесь</a>
      </p>
    </form>
  );
};

export default LoginForm;
