import React, { useState, useEffect } from "react";
import { getUsers } from "../../api/userApi";
import UserList from "./UserList";
import { Link } from "react-router-dom";
import Header from "../common/Header";

function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers().then(_users => setUsers(_users));
  }, []);

  return (
    <div className="container-fluid">
      <Header />
      <div className="body">
        <h2>Users</h2>
        <Link className="btn btn-primary" style={{ margin: "5px" }} to="/user/add">
          Add User
        </Link>
        <UserList users={users} />
      </div>
    </div>
  );
}

export default UsersPage;
