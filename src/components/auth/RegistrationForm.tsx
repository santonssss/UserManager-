import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
const SignUpForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            first_name: name,
          },
        },
      });

      if (error) {
        console.log(error);

        throw new Error(error.message);
      }

      const user = data?.user;

      if (user) {
        const currentDate = new Date().toISOString();
        const { error: insertError } = await supabase.from("profiles").insert([
          {
            id: user.id,
            email: user.email,
            name: user.user_metadata.first_name,
            last_online: currentDate,
            status: "active",
          },
        ]);

        if (insertError) {
          throw new Error(insertError.message);
        }
        setSuccess("Пожалуйста подтвердите почту!");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      alert(error);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="w-100 mx-auto p-4 "
      style={{ maxWidth: "400px" }}
    >
      <h2 className="text-center mb-4">Регистрация</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Имя
        </label>
        <input
          type="text"
          id="name"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
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
        Зарегистрироваться
      </button>
      <p className="text-center mt-3">
        Уже есть аккаунт? <a href="/login">Войдите</a>
      </p>
    </form>
  );
};

export default SignUpForm;
