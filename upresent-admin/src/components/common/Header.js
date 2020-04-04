import React from "react";
import { Link } from "react-router-dom";

function logout() {
  localStorage.clear();
}

const rightStyle = {
  float: "right",
};

function Header() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li>
          <Link to="/users">Users</Link>
        </li>
        <li style={rightStyle}>
          <Link to="/" onClick={logout}>
            Log Out
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Header;
