import React from "react";
import { Route, Redirect } from "react-router-dom";
// import * as config  from "./config/config.js"

const partnerUserRoles = ["PARTNER_ADMIN", "PARTNER_USER", "PARTNER_API_USER","PIGGY_ADMIN"];
console.log("Inside private route");
export const PrivateRoute = ({ component: Component, ...rest }) => (
  //console.log("Inside private route");
  <Route
    {...rest}
    render={props =>
      localStorage.getItem("user") &&  localStorage.getItem("userRole") && partnerUserRoles.indexOf(localStorage.getItem("userRole")) === -1? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: "/", state: { from: props.location } }} />
      )
      
    }
  />
);
