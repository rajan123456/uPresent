import React from "react";
import { Home } from "./app/views/Home";
import { Contact } from "./app/views/Contact";
import { Register } from "./app/views/Register";
import { Login } from "./app/views/Login";
import { StackNavigator } from "react-navigation";

const NavigationRoutes = StackNavigator(
  {
    HomeRT: {
      screen: Home
    },
    ContactRT: {
      screen: Contact
    },
    RegisterRT: {
      screen: Register
    },
    LoginRT: {
      screen: Login
    }
  },
  {
    initialRouteName: "HomeRT"
  }
);

export default class App extends React.Component {
  render() {
    return <NavigationRoutes />;
  }
}
