import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  name: string;
  email: string;
  lastLogin: string;
  status: "active" | "blocked";
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const checkUserStatus = async () => {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error(
        "Ошибка при получении текущего пользователя:",
        error.message
      );
      return false;
    }

    const user = data?.user;

    if (user) {
      const { data: profile, error: statusError } = await supabase
        .from("profiles")
        .select("status")
        .eq("email", user.email)
        .single();

      if (statusError) {
        console.error(
          "Ошибка при получении статуса пользователя:",
          statusError.message
        );
        return false;
      }

      if (profile && profile.status === "blocked") {
        sessionStorage.removeItem("accessToken");
        alert(
          "вы заблокированы, поэтому вы не можете блокировать других пользователей!"
        );
        navigate("/login");
        return false;
      }
    }

    return true;
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase.from("profiles").select("*");

    if (error) {
      console.error("Ошибка при загрузке пользователей:", error.message);
      return;
    }

    if (data) {
      const formattedUsers = data.map((user) => ({
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        lastLogin: user.last_online,
        status: user.status,
      }));
      setUsers(formattedUsers);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUsers(new Set(users.map((user) => user.id)));
    } else {
      setSelectedUsers(new Set());
    }
  };

  const handleSelectUser = (
    userId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedSelectedUsers = new Set(selectedUsers);
    if (e.target.checked) {
      updatedSelectedUsers.add(userId);
    } else {
      updatedSelectedUsers.delete(userId);
    }
    setSelectedUsers(updatedSelectedUsers);
  };

  const handleBlockUser = async (id: string) => {
    if (!(await checkUserStatus())) return;

    const { data } = await supabase.auth.getUser();
    const currentUserId = data?.user?.id;

    if (currentUserId === id) {
      alert(
        "Вы не можете блокировать других пользователей, когда вы заблокированы."
      );
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ status: "blocked" })
      .eq("id", id);

    if (error) {
      console.error("Ошибка блокировки пользователя:", error.message);
    } else {
      setUsers(
        users.map((user) =>
          user.id === id ? { ...user, status: "blocked" } : user
        )
      );
      fetchUsers();
    }
  };

  const handleUnblockUser = async (id: string) => {
    if (!(await checkUserStatus())) return;

    const { data } = await supabase.auth.getUser();
    const currentUserId = data?.user?.id;

    if (currentUserId === id) {
      alert(
        "Вы не можете разблокировать других пользователей, когда вы заблокированы."
      );
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ status: "active" })
      .eq("id", id);

    if (error) {
      console.error("Ошибка разблокировки пользователя:", error.message);
    } else {
      setUsers(
        users.map((user) =>
          user.id === id ? { ...user, status: "active" } : user
        )
      );
      fetchUsers();
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!(await checkUserStatus())) return;

    const { error } = await supabase.from("profiles").delete().eq("id", id);

    if (error) {
      console.error("Ошибка удаления пользователя:", error.message);
    } else {
      setUsers(users.filter((user) => user.id !== id));
    }
    fetchUsers();
  };

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <div className="container mt-5">
      <div className="d-flex flex-column mb-3">
        <button
          className="btn btn-danger"
          onClick={() =>
            Array.from(selectedUsers).forEach((id) => handleBlockUser(id))
          }
        >
          Заблокировать
        </button>
        <button
          className="btn btn-success"
          onClick={() =>
            Array.from(selectedUsers).forEach((id) => {
              console.log("Zablokirov");
              handleUnblockUser(id);
            })
          }
        >
          Разблокировать
        </button>
        <button
          className="btn btn-warning"
          onClick={() =>
            Array.from(selectedUsers).forEach((id) => handleDeleteUser(id))
          }
        >
          Удалить
        </button>{" "}
        <button className="btn btn-secondary mt-3" onClick={handleLogout}>
          Выйти
        </button>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">
              <input
                type="checkbox"
                className="form-check-input"
                id="selectAll"
                onChange={handleSelectAll}
              />
            </th>
            <th scope="col">Имя</th>
            <th scope="col">Email</th>
            <th scope="col">Последнее время входа</th>
            <th scope="col">Статус</th>
            <th scope="col">Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={selectedUsers.has(user.id)}
                    onChange={(e) => handleSelectUser(user.id, e)}
                  />
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.lastLogin}</td>
                <td>{user.status === "active" ? "Активен" : "Заблокирован"}</td>
                <td>
                  {user.status === "active" ? (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleBlockUser(user.id)}
                    >
                      Заблокировать
                    </button>
                  ) : (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleUnblockUser(user.id)}
                    >
                      Разблокировать
                    </button>
                  )}
                  <button
                    className="btn btn-warning btn-sm ms-2"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center">
                Пользователи не найдены.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
