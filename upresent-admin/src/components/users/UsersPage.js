import React, { useState, useEffect } from "react";
import { getUsers } from "../../api/userApi";
import UserList from "./UserList";
import { Link } from "react-router-dom";
import Header from "../common/Header";

function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers().then((_users) => {
      let activeUsers = [];
      _users.data.forEach((element) => {
        if (element.isActive === 1) activeUsers.push(element);
      });
      setUsers(activeUsers);
    });
  }, []);

  return (
    <div className="container-fluid">
      <Header />
      <div className="main" style={{padding: '10px'}}>
        <h2 style={{display: 'inline-block'}}>Users</h2>
        <Link
          className="btn btn-primary"
          style={{ marginBottom: "25px", float:'right' }}
          to="/user/add"
        >
          Add User
        </Link>
        <UserList users={users} />
      </div>
    </div>
  );
}

export default UsersPage;
