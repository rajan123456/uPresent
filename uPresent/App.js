import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {About} from './app/views/About';
import {Home} from './app/views/Home';
import {Login} from './app/views/Login';
import {Register} from './app/views/Register';

const Stack = createStackNavigator();

export default class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{headerShown: false}}
          initialRouteName="HomeRT">
          <Stack.Screen name="HomeRT" component={Home} />
          <Stack.Screen name="RegisterRT" component={Register} />
          <Stack.Screen name="LoginRT" component={Login} />
          <Stack.Screen name="AboutRT" component={About} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
