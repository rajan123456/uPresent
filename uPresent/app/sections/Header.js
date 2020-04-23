import React from 'react';
import {Alert, Image, Text, View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export class Header extends React.Component {
  constructor(props) {
    super(props);
    this.toggleUser = this.toggleUser.bind(this);
    this.fetchCredentials = this.fetchCredentials.bind(this);

    this.state = {isLoggedIn: false, loggedUser: false};
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

  async toggleUser() {
    let credentials = {};
    await AsyncStorage.getItem('credentials', (errs, result) => {
      if (!errs) {
        if (result !== null) {
          credentials = JSON.parse(result);
        }
      }
    });
    if (this.state.isLoggedIn) {
      await AsyncStorage.removeItem('credentials');
      this.setState({
        isLoggedIn: false,
        loggedUser: false,
      });
      Alert.alert('User Logged Out');
    } else {
      this.props.navigate('LoginRT');
    }
  }

  async fetchCredentials() {
    let credentials = {};
    await AsyncStorage.getItem('credentials', (errs, result) => {
      if (!errs) {
        if (result !== null) {
          credentials = JSON.parse(result);
          this.setState({
            isLoggedIn: true,
            loggedUser: credentials.username,
          });
        }
      }
    });
  }

  async componentDidMount() {
    await this.fetchCredentials();
  }

  render() {
    this.fetchCredentials();
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
    paddingTop: 20,
    textAlign: 'right',
    color: '#000000',
    fontSize: 25,
    flex: 1.5,
  },
  headStyle: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 10,
    backgroundColor: '#ffffff',
    flex: 1.5,
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderColor: '#ffffff',
  },
  logoStyle: {
    flex: 1.5,
    width: undefined,
    height: undefined,
  },
};
