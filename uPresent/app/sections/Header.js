import React from 'react';
import {Alert, Image, Text, View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isLoggedIn: false, loggedUser: false};
  }

  toggleUser = () => {
    if (this.state.isLoggedIn) {
      AsyncStorage.setItem('userLoggedIn', 'none', (err, result) => {
        this.setState({
          isLoggedIn: false,
          loggedUser: false,
        });
        Alert.alert('User Logged Out');
      });
    } else {
      this.props.navigate('LoginRT');
    }
  };

  componentDidMount() {
    AsyncStorage.getItem('userLoggedIn', (err, result) => {
      if (result === 'none') {
        console.log('NONE');
      } else if (result === null) {
        AsyncStorage.setItem('userLoggedIn', 'none', (err, result) => {
          console.log('Set user to NONE');
        });
      } else {
        this.setState({
          isLoggedIn: true,
          loggedUser: result,
        });
      }
    });
  }

  render() {
    let display = this.state.isLoggedIn
      ? this.state.loggedUser
      : this.props.message;
    return (
      <View style={styles.headStyle}>
        <Image
          style={styles.logoStyle}
          source={require('./img/uPresent_Logo.png')}
        />
        <Text style={styles.headText} onPress={this.toggleUser}>
          {display}
        </Text>
      </View>
    );
  }
}

const styles = {
  headText: {
    paddingTop: 10,
    textAlign: 'right',
    color: '#000000',
    fontSize: 20,
    flex: 1,
  },
  headStyle: {
    paddingTop: 10,
    paddingRight: 10,
    backgroundColor: '#ffffff',
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderColor: '#ffffff',
  },
  logoStyle: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
};
