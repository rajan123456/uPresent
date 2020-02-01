import React from "react";
import { Home } from "./app/views/Home";
import { Contact } from "./app/views/Contact";
import { StackNavigator } from "react-navigation";

const NavigationRoutes = StackNavigator(
  {
    HomeRT: {
      screen: Home
    },
    ContactRT: {
      screen: Contact
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
