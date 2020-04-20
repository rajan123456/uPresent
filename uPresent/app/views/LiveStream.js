import React from 'react';
import {
  Alert,
  Dimensions,
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {NodeCameraView} from 'react-native-nodemediaclient';
import baseUrlRtmp from '../config/config';
import * as Keychain from 'react-native-keychain';

const LiveStatus = {
  CANCEL: -1,
  REGISTER: 0,
  ON_LIVE: 1,
  FINISH: 2,
};

export class LiveStream extends React.Component {
  constructor(props) {
    super(props);

    this.onBeginLiveStream = this.onBeginLiveStream.bind(this);
    this.onFinishLiveStream = this.onFinishLiveStream.bind(this);
    this.renderCancelStreamerButton = this.renderCancelStreamerButton.bind(
      this,
    );
    this.renderStreamerUI = this.renderStreamerUI.bind(this);

    this.state = {
      liveStatus: LiveStatus.REGISTER,
      loggedUser: false,
      isLoggedIn: false,
    };
  }

  onBeginLiveStream = () => {
    this.setState({liveStatus: LiveStatus.ON_LIVE});
    this.vbCamera.start();
    // call videoProccssor
  };

  onFinishLiveStream = () => {
    this.setState({liveStatus: LiveStatus.FINISH});
    this.vbCamera.stop();
    Alert.alert('Account created.');
    this.props.navigation.navigate('HomeRT');
  };

  renderCancelStreamerButton = () => {
    return (
      <TouchableOpacity
        style={styles.buttonCancel}
        onPress={this.onPressCancelStreamer}>
        <Image
          source={require('../sections/img/ico_cancel.png')}
          style={styles.iconCancel}
        />
      </TouchableOpacity>
    );
  };

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

  async componentDidMount() {
    await this.fetchCredentials();
  }

  renderStreamerUI = () => {
    const {liveStatus} = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#6a51ae" />
        <NodeCameraView
          style={styles.streamerCameraView}
          ref={vb => {
            this.vbCamera = vb;
          }}
          outputUrl={baseUrlRtmp + this.state.loggedUser.toString()}
          camera={{cameraId: 1, cameraFrontMirror: true}}
          audio={{bitrate: 32000, profile: 1, samplerate: 44100}}
          video={{
            preset: 1,
            bitrate: 500000,
            profile: 1,
            fps: 15,
            videoFrontMirror: false,
          }}
          smoothSkinLevel={3}
          autopreview={true}
        />
        <View style={styles.container}>
          {this.renderCancelStreamerButton()}
          {liveStatus === LiveStatus.REGISTER && (
            <TouchableOpacity
              style={styles.beginLiveStreamButton}
              onPress={this.onBeginLiveStream}>
              <Text style={styles.beginLiveStreamText}>Begin Live</Text>
            </TouchableOpacity>
          )}
          {liveStatus === LiveStatus.ON_LIVE && (
            <TouchableOpacity
              style={styles.finishLiveStreamButton}
              onPress={this.onFinishLiveStream}>
              <Text style={styles.beginLiveStreamText}>Finish</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  render() {
    return this.renderStreamerUI();
  }
}

const {width, height} = Dimensions.get('window');

const styles = {
  buttonCancel: {
    height: 40,
    flexDirection: 'row',
    position: 'absolute',
    top: 30,
    left: 15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  iconCancel: {
    width: 20,
    height: 20,
    tintColor: 'white',
  },
  container: {
    flex: 1,
    zIndex: 2,
  },
  streamerCameraView: {
    position: 'absolute',
    height: height,
    width: width,
    zIndex: 1,
  },
  beginLiveStreamButton: {
    position: 'absolute',
    top: 30,
    right: 15,
    backgroundColor: '#a55eea',
    paddingVertical: 15,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  beginLiveStreamText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  finishLiveStreamButton: {
    position: 'absolute',
    top: 30,
    right: 15,
    backgroundColor: '#ff6b6b',
    paddingVertical: 15,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
};
