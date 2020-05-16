import React from 'react';
import {
  Alert,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {TextField} from 'react-native-material-textfield';
import {RaisedTextButton} from 'react-native-material-buttons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import ModalDropdown from 'react-native-modal-dropdown';
import ImagePicker from 'react-native-image-crop-picker';
import {saveFile} from '../api/fileApi';
import {saveUser, getUserByName} from '../api/userApi';
import {getAllSchools} from '../api/schoolApi';

export class Register extends React.Component {
  constructor(props) {
    super(props);

    this.onFocus = this.onFocus.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onClear = this.onClear.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onSubmitUsername = this.onSubmitUsername.bind(this);
    this.onSubmitPassword = this.onSubmitPassword.bind(this);
    this.onSubmitPasswordConfirm = this.onSubmitPasswordConfirm.bind(this);
    this.onAccessoryPress = this.onAccessoryPress.bind(this);
    this.dropdownOnSelect = this.dropdownOnSelect.bind(this);

    this.usernameRef = this.updateRef.bind(this, 'username');
    this.passwordRef = this.updateRef.bind(this, 'password');
    this.passwordConfirmRef = this.updateRef.bind(this, 'passwordConfirm');
    this.schoolRef = this.updateRef.bind(this, 'school');
    this.schools = this.updateRef.bind(this, 'schools');

    this.renderPasswordAccessory = this.renderPasswordAccessory.bind(this);

    this.state = {
      username: '',
      password: '',
      passwordConfirm: '',
      school: '',
      schools: [],
      secureTextEntry: true,
      images: null,
      imageIds: [],
      videoFlag: false,
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

  dropdownOnSelect(idx, value) {
    this.setState({
      school: value,
    });
  }

  onChangeText(text) {
    ['username', 'password', 'passwordConfirm']
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

  onSubmitPassword() {
    this.passwordConfirm.focus();
  }

  onSubmitPasswordConfirm() {}

  onSubmit() {
    let errors = {};

    ['username', 'password', 'passwordConfirm'].forEach(name => {
      let value = this[name].value();

      if (!value) {
        errors[name] = 'Should not be empty';
      }
    });

    if (this.password.value() !== this.passwordConfirm.value()) {
      errors.passwordConfirm = 'Passwords do not match';
    } else {
      getUserByName(this.username.value()).then(_resp => {
        if (_resp.message !== 'User data not found.') {
          errors.username = 'An account with the same username alread exists.';
        }
      });
    }

    this.setState({errors});

    if (Object.entries(errors).length === 0 && errors.constructor === Object) {
      let user = {
        imageId: this.state.imageIds,
        isActive: 1,
        name: this.username.value(),
        username: this.username.value(),
        password: this.password.value(),
        school: this.state.school,
      };

      saveUser(user).then(async _resp => {
        let auth = {
          username: this.state.username,
          password: this.state.password,
        };
        await AsyncStorage.setItem('credentials', JSON.stringify(auth));
        if (!this.state.videoFlag) {
          Alert.alert('Account created');
          this.props.navigation.navigate('HomeRT');
        } else {
          this.props.navigation.navigate('LiveStreamRT');
        }
      });
    }
  }

  updateRef(name, ref) {
    this[name] = ref;
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

  onAccessoryPress() {
    this.setState(({secureTextEntry}) => ({
      secureTextEntry: !secureTextEntry,
    }));
  }

  cancelRegister = () => {
    Alert.alert('Registration cancelled');
    this.props.navigation.navigate('HomeRT');
  };

  pickFromCamera(cropping, mediaType = 'photo') {
    ImagePicker.openCamera({
      cropping: cropping,
      width: 50,
      height: 50,
      includeExif: true,
      mediaType,
    }).then(i => {
      let imageHolder = {
        uri: i.path,
        width: i.width,
        height: i.height,
        mime: i.mime,
      };
      let imagesHolder = this.state.images ? this.state.images : [];
      imagesHolder.push(imageHolder);
      this.setState({
        images: imagesHolder,
      });

      let photo = {uri: imageHolder.uri};
      let formData = new FormData();
      formData.append('file', {
        uri: photo.uri,
        name: 'image.jpg',
        type: 'image/jpeg',
      });
      saveFile(formData).then(_resp => {
        let imageIdsHolder = this.state.imageIds ? this.state.imageIds : [];
        imageIdsHolder.push(_resp.data);
        this.setState({
          imageIds: imageIdsHolder,
        });
      });
    });
  }

  async componentDidMount() {
    await AsyncStorage.getItem('videoRegistration', (errs, result) => {
      if (!errs) {
        if (result !== null) {
          this.setState({videoFlag: result === 'true'});
        }
      }
    });
    getAllSchools().then(_resp => {
      if (_resp.message === 'ok') {
        this.setState({
          schools: _resp.data.map(a => a.schoolCode).sort(),
        });
      }
    });
  }

  onClear() {
    this.setState({
      username: '',
      password: '',
      passwordConfirm: '',
      school: '',
      //schools: [], -- Do not clear schools
      secureTextEntry: true,
      images: null,
      imageIds: [],
      //videoFlag: false, -- Do not clear videoFlag
    });
    this.username.clear();
    this.password.clear();
    this.passwordConfirm.clear();
  }

  render() {
    let {errors = {}, secureTextEntry, ...data} = this.state;
    let {username, password, passwordConfirm, schools} = data;

    return (
      <SafeAreaView style={styles.safeContainer}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <View style={styles.headerViewStyle}>
              <Text style={styles.headerTextStyle}>Register</Text>
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
              maxLength={15}
              renderRightAccessory={this.renderPasswordAccessory}
            />
            <TextField
              ref={this.passwordConfirmRef}
              secureTextEntry={secureTextEntry}
              autoCapitalize="none"
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              clearTextOnFocus={true}
              onFocus={this.onFocus}
              onChangeText={this.onChangeText}
              onSubmitEditing={this.onSubmitPasswordConfirm}
              returnKeyType="done"
              label="Confirm Password"
              error={errors.passwordConfirm}
              maxLength={15}
              renderRightAccessory={this.renderPasswordAccessory}
            />
            <ModalDropdown
              style={styles.dropdown}
              dropdownStyle={styles.dropdownStyle}
              dropdownTextStyle={styles.dropdownTextStyle}
              dropdownTextHighlightStyle={styles.dropdownTextHighlightStyle}
              ref={this.schoolRef}
              options={this.state.schools}
              defaultValue="Select School"
              onSelect={(idx, value) => this.dropdownOnSelect(idx, value)}
            />
            {!this.state.videoFlag ? (
              <TouchableHighlight style={styles.buttonStyle}>
                <RaisedTextButton
                  onPress={() => this.pickFromCamera(true)}
                  title="Add Your Pictures"
                  color={TextField.defaultProps.tintColor}
                  titleColor="white"
                />
              </TouchableHighlight>
            ) : (
              <View />
            )}
            <View style={styles.imageTileView}>
              {this.state.images && !this.state.videoFlag
                ? this.state.images.map(i => {
                    return (
                      <Image
                        source={i}
                        style={styles.imageTileStyle}
                        key={i.uri}
                      />
                    );
                  })
                : null}
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableHighlight style={styles.buttonStyle}>
              <RaisedTextButton
                onPress={this.onSubmit}
                title="Register"
                color={TextField.defaultProps.tintColor}
                titleColor="white"
              />
            </TouchableHighlight>
            <TouchableHighlight style={styles.buttonStyle}>
              <RaisedTextButton
                onPress={this.onClear}
                title="Clear"
                color={TextField.defaultProps.tintColor}
                titleColor="white"
              />
            </TouchableHighlight>
            <TouchableHighlight style={styles.buttonStyle}>
              <RaisedTextButton
                onPress={this.cancelRegister}
                title="Cancel"
                color={TextField.defaultProps.tintColor}
                titleColor="white"
              />
            </TouchableHighlight>
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
  imageTileView: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    padding: 20,
  },
  imageTileStyle: {
    width: 50,
    height: 50,
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
  buttonStyle: {
    height: 40,
    width: 180,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'center',
  },
  dropdown: {
    margin: 8,
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 1,
  },
  dropdownTextStyle: {
    backgroundColor: '#000',
    color: '#fff',
  },
  dropdownTextHighlightStyle: {
    backgroundColor: '#fff',
    color: '#000',
  },
  dropdownStyle: {
    width: 150,
    height: 300,
    borderColor: 'cornflowerblue',
    borderWidth: 2,
    borderRadius: 3,
  },
};
