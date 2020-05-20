import React from 'react';
import {
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
import {getAttendanceRecordsOfUser} from '../api/attendanceApi';

export class Records extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: false,
      loggedUser: false,
      attendanceRecords: [],
    };
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
    getAttendanceRecordsOfUser(this.state.loggedUser).then(_resp => {
      this.setState({
        attendanceRecords: _resp,
      });
    });
  }

  render() {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <View style={styles.headerViewStyle}>
              <Text style={styles.headerTextStyle}>Attendance Records</Text>
            </View>
            <View>
              <Text>
                Here are a list of accepted attendance records belonging to you:
              </Text>
              {this.state.attendanceRecords
                ? this.state.attendanceRecords.map(r => {
                    let dateRes = new Date(r.time_captured['$date']);
                    return (
                      <Text style={styles.headerTextStyle}>
                        {r.moduleId +
                          ' ' +
                          (dateRes.getMonth() + 1) +
                          '/' +
                          dateRes.getDate() +
                          '/' +
                          dateRes.getFullYear() +
                          ' ' +
                          dateRes.getHours() +
                          ':' +
                          (dateRes.getMinutes() < 10 ? '0' : '') +
                          dateRes.getMinutes() +
                          ':' +
                          (dateRes.getSeconds() < 10 ? '0' : '') +
                          dateRes.getSeconds()}
                      </Text>
                    );
                  })
                : null}
              <TouchableHighlight style={styles.buttonStyle}>
                <RaisedTextButton
                  onPress={() => this.props.navigation.navigate('HomeRT')}
                  title="Return Home"
                  color={TextField.defaultProps.tintColor}
                  titleColor="white"
                />
              </TouchableHighlight>
            </View>
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
