import React from "react";
import { Link } from "react-router-dom";
import { logout } from "../../helper/LoginHelper";

const rightStyle = {
  float: 'right'
}

function UserHeader() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li>
          <Link to="/users">Users</Link>
        </li>
        <li>
          <Link to="/partners">Partners</Link>
        </li>
        <li>
          <Link to="/orders">Orders</Link>
        </li>

        <li style={rightStyle}>
          <Link to="/" onClick={logout}>Log Out</Link>
        </li>
      </ul>
    </nav>
  );
}

export default UserHeader;
