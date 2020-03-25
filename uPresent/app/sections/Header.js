import React from 'react';
import {Alert, Image, Text, View} from 'react-native';
import * as Keychain from 'react-native-keychain';

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
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      await Keychain.resetGenericPassword();
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
    const credentials = await Keychain.getGenericPassword();
    console.log(credentials);
    if (!credentials) {
      console.log('No credentials stored');
    } else {
      this.setState({
        isLoggedIn: true,
        loggedUser: credentials.username,
      });
    }
  }

  componentDidMount() {
    this.fetchCredentials();
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
