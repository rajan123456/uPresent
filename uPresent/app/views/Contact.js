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
import {Header} from '../sections/Header';

export class Contact extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);

    this.onFocus = this.onFocus.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onSubmitName = this.onSubmitName.bind(this);
    this.onSubmitMsg = this.onSubmitMsg.bind(this);
    this.onSubmitEmail = this.onSubmitEmail.bind(this);

    this.nameRef = this.updateRef.bind(this, 'name');
    this.msgRef = this.updateRef.bind(this, 'msg');
    this.emailRef = this.updateRef.bind(this, 'email');

    this.state = {
      name: '',
      msg: '',
      email: '',
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
    ['name', 'msg', 'email']
      .map(name => ({name, ref: this[name]}))
      .forEach(({name, ref}) => {
        if (ref.isFocused()) {
          this.setState({[name]: text});
        }
      });
  }

  onSubmitName() {
    this.email.focus();
  }

  onSubmitEmail() {
    this.msg.focus();
  }

  onSubmitMsg() {
    this.msg.blue();
  }

  onSubmit() {
    let errors = {};

    ['name', 'email', 'msg'].forEach(name => {
      let value = this[name].value();

      if (!value) {
        errors[name] = 'Should not be empty';
      }
    });

    this.setState({errors});

    if (Object.entries(errors).length === 0 && errors.constructor === Object) {
      Alert.alert(this.state.name, this.state.msg);
      this.props.navigation.goBack();
    }
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

  render() {
    const {navigate} = this.props.navigation;
    let {errors = {}, ...data} = this.state;
    let {username, password, passwordConfirm} = data;

    return (
      <SafeAreaView style={styles.safeContainer}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <Header navigate={navigate} message="Press to Login" />
            <Text style={styles.heading}>Contact</Text>
            <TextField
              ref={this.nameRef}
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              onFocus={this.onFocus}
              onChangeText={this.onChangeText}
              onSubmitEditing={this.onSubmitName}
              returnKeyType="next"
              label="Name"
              error={errors.name}
            />
            <TextField
              ref={this.emailRef}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              onFocus={this.onFocus}
              onChangeText={this.onChangeText}
              onSubmitEditing={this.onSubmitEmail}
              returnKeyType="next"
              label="Email Address"
              error={errors.email}
            />
            <TextField
              ref={this.msgRef}
              onFocus={this.onFocus}
              onChangeText={this.onChangeText}
              onSubmitEditing={this.onSubmitMsg}
              returnKeyType="done"
              multiline={true}
              blurOnSubmit={true}
              label="Your Message"
              error={errors.msg}
              characterRestriction={140}
            />
          </View>
          <View style={styles.buttonContainer}>
            <RaisedTextButton
              onPress={this.onSubmit}
              title="Submit"
              color={TextField.defaultProps.tintColor}
              titleColor="white"
            />
            <RaisedTextButton
              onPress={() => this.props.navigation.goBack()}
              title="Back"
              color={TextField.defaultProps.tintColor}
              titleColor="white"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

let styles = {
  scroll: {
    backgroundColor: 'transparent',
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
};
