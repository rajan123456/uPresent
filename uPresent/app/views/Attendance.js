import React from 'react';
import {
  Button,
  PermissionsAndroid,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export class Attendance extends React.Component {
  constructor(props) {
    super(props);

    this.hasLocationPermission = this.hasLocationPermission.bind(this);
    this.getLocation = this.getLocation.bind(this);

    this.state = {
      loading: false,
      updatesEnabled: false,
      location: {},
    };
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

    if (hasPermission) return true;

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

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

    if (!hasLocationPermission) return;

    this.setState({loading: true}, () => {
      Geolocation.getCurrentPosition(
        position => {
          this.setState({location: position, loading: false});
          console.log(position);
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

  render() {
    const {loading, location, updatesEnabled} = this.state;
    return (
      <ScrollView style={styles.container}>
        <View style={styles.container}>
          <Button
            title="Get Location"
            onPress={this.getLocation}
            disabled={this.state.loading || this.state.updatesEnabled}
          />
          <View style={styles.result}>
            <Text>{JSON.stringify(this.state.location, null, 4)}</Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    paddingHorizontal: 12,
  },
  result: {
    borderWidth: 1,
    borderColor: '#666',
    width: '100%',
    paddingHorizontal: 16,
  },
  buttons: {
    flexDirection: 'row',
    marginVertical: 12,
    width: '100%',
  },
};
