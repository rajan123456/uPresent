import AdminHeader from "./AdminHeader";
import UserHeader from "./UserHeader";
import React from "react";

class Header extends React.Component {
  render() {
    const userRole = JSON.parse(localStorage.getItem("userRole"));
    const PIGGY_ADMIN = "PIGGY_ADMIN";
    const PARTNER_ADMIN = "PARTNER_ADMIN";

    let pageRender;

    if (userRole === PIGGY_ADMIN || userRole === PARTNER_ADMIN) {
      pageRender = <AdminHeader />;
    } else {
      pageRender = <UserHeader />;
    }
    return <div className="container-fluid">{pageRender}</div>;
  }
}
export default Header;
