import React from 'react';
import {StackNavigator} from 'react-navigation';
import {About} from './app/views/About';
import {Contact} from './app/views/Contact';
import {Home} from './app/views/Home';
import {Login} from './app/views/Login';
import {Register} from './app/views/Register';

const NavigationRoutes = StackNavigator(
  {
    HomeRT: {
      screen: Home,
    },
    ContactRT: {
      screen: Contact,
    },
    RegisterRT: {
      screen: Register,
    },
    LoginRT: {
      screen: Login,
    },
    AboutRT: {
      screen: About,
    },
  },
  {
    initialRouteName: 'HomeRT',
  },
);

export default class App extends React.Component {
  render() {
    return <NavigationRoutes />;
  }
}
