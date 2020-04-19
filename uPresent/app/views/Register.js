import React from 'react';
import {
  Alert,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {TextField} from 'react-native-material-textfield';
import {RaisedTextButton} from 'react-native-material-buttons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-crop-picker';
import {saveFile} from '../api/fileApi';
import {saveUser, getUserByName} from '../api/userApi';
import {userDataNotFound} from '../constants/userApiConstants';
import {
  shouldNotBeEmpty,
  passwordsDoNotMatch,
  accountAlreadyExists,
  accountCreated,
  registrationCancelled,
} from '../constants/registerConstants';

export class Register extends React.Component {
  constructor(props) {
    super(props);

    this.onFocus = this.onFocus.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onSubmitUsername = this.onSubmitUsername.bind(this);
    this.onSubmitPassword = this.onSubmitPassword.bind(this);
    this.onSubmitPasswordConfirm = this.onSubmitPasswordConfirm.bind(this);
    this.onSubmitSchool = this.onSubmitSchool.bind(this);
    this.onAccessoryPress = this.onAccessoryPress.bind(this);

    this.usernameRef = this.updateRef.bind(this, 'username');
    this.passwordRef = this.updateRef.bind(this, 'password');
    this.passwordConfirmRef = this.updateRef.bind(this, 'passwordConfirm');
    this.schoolRef = this.updateRef.bind(this, 'school');

    this.renderPasswordAccessory = this.renderPasswordAccessory.bind(this);

    this.state = {
      username: '',
      password: '',
      passwordConfirm: '',
      school: '',
      secureTextEntry: true,
      images: null,
      imageIds: [],
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

  onSubmitPasswordConfirm() {
    this.school.focus();
  }

  onSubmitSchool() {}

  onSubmit() {
    let errors = {};

    ['username', 'password', 'passwordConfirm', 'school'].forEach(name => {
      let value = this[name].value();

      if (!value) {
        errors[name] = shouldNotBeEmpty;
      }
    });

    if (this.password.value() !== this.passwordConfirm.value()) {
      errors.passwordConfirm = passwordsDoNotMatch;
    } else {
      getUserByName(this.username.value()).then(_resp => {
        if (_resp.message !== userDataNotFound) {
          errors.username = accountAlreadyExists;
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
        school: this.school.value(),
      };

      saveUser(user).then(_resp => {
        Alert.alert(accountCreated);
        this.props.navigation.navigate('HomeRT');
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
    Alert.alert(registrationCancelled);
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

  render() {
    let {errors = {}, secureTextEntry, ...data} = this.state;
    let {username, password, passwordConfirm} = data;

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
            <TextField
              ref={this.schoolRef}
              autoCorrect={false}
              enablesReturnKeyAutomatically={true}
              onFocus={this.onFocus}
              onChangeText={this.onChangeText}
              onSubmitEditing={this.onSubmitSchool}
              returnKeyType="next"
              label="School"
              error={errors.school}
            />
            <RaisedTextButton
              onPress={() => this.pickFromCamera(true)}
              title="Add Your Pictures"
              color={TextField.defaultProps.tintColor}
              titleColor="white"
            />
            <View style={styles.imageTileView}>
              {this.state.images
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
            <RaisedTextButton
              onPress={this.onSubmit}
              title="Register"
              color={TextField.defaultProps.tintColor}
              titleColor="white"
            />
            <RaisedTextButton
              onPress={this.cancelRegister}
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
};
