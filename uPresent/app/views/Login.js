import React from 'react';
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {TextField} from 'react-native-material-textfield';
import {RaisedTextButton} from 'react-native-material-buttons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {loginUser} from '../api/authApi';
import * as Keychain from 'react-native-keychain';

let defaults = {
  username: '',
  password: '',
};

export class Login extends React.Component {
  constructor(props) {
    super(props);

    this.onFocus = this.onFocus.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onSubmitUsername = this.onSubmitUsername.bind(this);
    this.onSubmitPassword = this.onSubmitPassword.bind(this);
    this.onAccessoryPress = this.onAccessoryPress.bind(this);

    this.usernameRef = this.updateRef.bind(this, 'username');
    this.passwordRef = this.updateRef.bind(this, 'password');

    this.renderPasswordAccessory = this.renderPasswordAccessory.bind(this);

    this.state = {
      secureTextEntry: true,
      ...defaults,
    };
  }

  onFocus() {
    let {errors = {}} = this.state;

    for (let name in errors) {
      let ref = this[name];

      if (ref && ref.isFocused()) {
        delete errors[name];
      }
    }
    this.setState({errors});
  }

  onChangeText(text) {
    ['username', 'password']
      .map(name => ({name, ref: this[name]}))
      .forEach(({name, ref}) => {
        if (ref.isFocused()) {
          this.setState({[name]: text});
        }
      });
  }

  onSubmitUsername() {
    this.password.focus();
  }

  onSubmitPassword() {}

  onSubmit() {
    let errors = {};

    ['username', 'password'].forEach(name => {
      let value = this[name].value();

      if (!value) {
        errors[name] = 'Should not be empty';
      }
    });

    this.setState({errors});

    if (Object.entries(errors).length === 0 && errors.constructor === Object) {
      let auth = {
        password: this.state.password,
        username: this.state.username,
      };
      loginUser(auth).then(async _resp => {
        if (
          _resp.message ===
          'Unauthorised access. Please retry with correct credentials.'
        ) {
          Alert.alert('Password is incorrect');
        } else if (_resp.message === 'ok' && _resp.data === 'STUDENT') {
          await Keychain.setGenericPassword(
            this.state.username,
            this.state.password,
          );
          Alert.alert('Welcome, you are logged in.');
          this.props.navigation.push('HomeRT');
        } else {
          Alert.alert('The account does not exist');
        }
      });
    }
  }

  onAccessoryPress() {
    this.setState(({secureTextEntry}) => ({
      secureTextEntry: !secureTextEntry,
    }));
  }

  renderPasswordAccessory() {
    let {secureTextEntry} = this.state;
    let name = secureTextEntry ? 'visibility' : 'visibility-off';

    return (
      <MaterialIcon
        size={24}
        name={name}
        color={TextField.defaultProps.baseColor}
        onPress={this.onAccessoryPress}
        suppressHighlighting={true}
      />
    );
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

  cancelLogin = () => {
    Alert.alert('Login cancelled');
    this.props.navigation.navigate('HomeRT');
  };

  render() {
    let {errors = {}, secureTextEntry, ...data} = this.state;
    let {username, password} = data;

    return (
      <SafeAreaView style={styles.safeContainer}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <View style={styles.headerViewStyle}>
              <Text style={styles.headerTextStyle}>Login</Text>
            </View>
            <TextField
              ref={this.usernameRef}
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              onFocus={this.onFocus}
              onChangeText={this.onChangeText}
              onSubmitEditing={this.onSubmitUsername}
              returnKeyType="next"
              label="Username"
              error={errors.username}
            />
            <TextField
              ref={this.passwordRef}
              secureTextEntry={secureTextEntry}
              autoCapitalize="none"
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              clearTextOnFocus={true}
              onFocus={this.onFocus}
              onChangeText={this.onChangeText}
              onSubmitEditing={this.onSubmitPassword}
              returnKeyType="next"
              label="Password"
              error={errors.password}
              maxLength={30}
              renderRightAccessory={this.renderPasswordAccessory}
            />
          </View>
          <View style={styles.buttonContainer}>
            <RaisedTextButton
              onPress={this.onSubmit}
              title="Login"
              color={TextField.defaultProps.tintColor}
              titleColor="white"
            />
            <RaisedTextButton
              onPress={this.cancelLogin}
              title="Cancel"
              color={TextField.defaultProps.tintColor}
              titleColor="white"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = {
  scroll: {
    backgroundColor: '#EFEFF4',
  },
  container: {
    margin: 8,
    marginTop: Platform.select({ios: 8, android: 32}),
    flex: 1,
  },
  contentContainer: {
    padding: 8,
  },
  buttonContainer: {
    paddingTop: 8,
    margin: 8,
  },
  safeContainer: {
    flex: 1,
    backgroundColor: '#E8EAF6',
  },
  headerViewStyle: {
    borderBottomWidth: 1,
    backgroundColor: '#f7f7f8',
    borderColor: '#c8c7cc',
  },
  headerTextStyle: {
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
};
