import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function UserList(props) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Username</th>
          <th>Role</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {props.users &&
          props.users.length > 0 &&
          props.users.map((user) => {
            return (
              <tr key={user.username}>
                <td>{user.name}</td>
                <td>
                  <Link to={"/user/" + user.username}>{user.username}</Link>
                </td>
                <td>{user.userType}</td>
                <td>{user.isActive === 1 ? "Active" : "Inactive"}</td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
}

UserList.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      userType: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default UserList;
