import React from 'react';
import {
  Alert,
  Image,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import ImagePicker from 'react-native-image-crop-picker';
import * as Keychain from 'react-native-keychain';
import ModalDropdown from 'react-native-modal-dropdown';
import {RaisedTextButton} from 'react-native-material-buttons';
import {TextField} from 'react-native-material-textfield';
import {saveAttendance} from '../api/attendanceApi';
import {saveFile} from '../api/fileApi';
import {getModulesOfUser} from '../api/moduleApi';
import {getUserByName} from '../api/userApi';

export class Attendance extends React.Component {
  constructor(props) {
    super(props);

    this.hasLocationPermission = this.hasLocationPermission.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.fetchCredentials = this.fetchCredentials.bind(this);
    this.dropdownOnSelect = this.dropdownOnSelect.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.cancelAttendance = this.cancelAttendance.bind(this);

    this.loggedUser = this.updateRef.bind(this, 'loggedUser');
    this.modules = this.updateRef.bind(this, 'modules');
    this.moduleRef = this.updateRef.bind(this, 'module');

    this.state = {
      loading: false,
      updatesEnabled: false,
      location: {},
      images: null,
      imageIds: [],
      modules: [],
      module: '',
      isLoggedIn: false,
      loggedUser: false,
    };
  }

  async fetchCredentials() {
    const credentials = await Keychain.getGenericPassword();
    if (!credentials) {
      console.log('No credentials stored');
    } else {
      this.setState({
        isLoggedIn: true,
        loggedUser: credentials.username,
      });
    }
  }

  async UNSAFE_componentWillMount() {
    await this.fetchCredentials();
    if (!this.state.isLoggedIn) {
      Alert.alert('Please log in first!');
      this.props.navigation.push('HomeRT');
    }
    getModulesOfUser(this.state.loggedUser).then(_resp => {
      this.setState({
        modules: _resp.data,
      });
    });
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

  hasLocationPermission = async () => {
    if (
      Platform.OS === 'ios' ||
      (Platform.OS === 'android' && Platform.Version < 23)
    ) {
      return true;
    }
    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (hasPermission) {
      return true;
    }
    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }
    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }
    return false;
  };

  getLocation = async () => {
    const hasLocationPermission = await this.hasLocationPermission();
    if (!hasLocationPermission) {
      return;
    }
    this.setState({loading: true}, () => {
      Geolocation.getCurrentPosition(
        position => {
          this.setState({location: position, loading: false});
        },
        error => {
          this.setState({location: error, loading: false});
          console.log(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
          distanceFilter: 50,
          forceRequestLocation: true,
        },
      );
    });
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

  dropdownOnSelect(idx, value) {
    this.setState({
      module: value,
    });
  }

  async onSubmit() {
    await this.getLocation();
    getUserByName(this.state.loggedUser).then(_resp => {
      let attendance = {
        username: this.state.loggedUser,
        location: [
          this.state.location.coords.latitude,
          this.state.location.coords.longitude,
        ],
        moduleId: this.state.module,
        capturedImageId: this.state.imageIds[0],
        school: _resp.data.school,
      };
      saveAttendance(attendance).then(_respAtt => {
        if (_respAtt.message === 'Not in the right vicinity') {
          Alert.alert('Geofence check failed. Try again later.');
          this.props.navigation.push('HomeRT');
        } else if (_respAtt.message != null) {
          Alert.alert('Something went wrong. Try again later.');
          this.props.navigation.push('HomeRT');
        } else if (_respAtt.id !== null) {
          console.log(_respAtt);
          Alert.alert('Attendance submitted.');
          this.props.navigation.push('HomeRT');
        }
      });
    });
  }

  cancelAttendance() {
    Alert.alert('Attendance Cancelled');
    this.props.navigation.navigate('HomeRT');
  }

  render() {
    const {loading, location, updatesEnabled, modules} = this.state;
    return (
      <SafeAreaView style={styles.safeContainer}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <View style={styles.headerViewStyle}>
              <Text style={styles.headerTextStyle}>Attendance</Text>
            </View>
            <ModalDropdown
              style={styles.dropdown}
              dropdownStyle={styles.dropdownStyle}
              dropdownTextStyle={styles.dropdownTextStyle}
              dropdownTextHighlightStyle={styles.dropdownTextHighlightStyle}
              ref={this.moduleRef}
              options={this.state.modules}
              defaultValue="Select Module"
              onSelect={(idx, value) => this.dropdownOnSelect(idx, value)}
            />
            <TouchableHighlight style={styles.buttonStyle}>
              <RaisedTextButton
                onPress={() => this.pickFromCamera(true)}
                title="Take a Picture"
                color={TextField.defaultProps.tintColor}
                titleColor="white"
              />
            </TouchableHighlight>
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
            <TouchableHighlight style={styles.buttonStyle}>
              <RaisedTextButton
                onPress={this.onSubmit}
                title="Submit"
                color={TextField.defaultProps.tintColor}
                titleColor="white"
              />
            </TouchableHighlight>
            <TouchableHighlight style={styles.buttonStyle}>
              <RaisedTextButton
                onPress={this.cancelAttendance}
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
};
