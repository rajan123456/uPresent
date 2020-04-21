import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

export class Menu extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.buttonStyles}
            onPress={() => this.props.navigate('AttendanceRT')}>
            <Text style={styles.buttonText}>ATTENDANCE</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonStyles}
            onPress={() => this.props.navigate('RegisterRT')}>
            <Text style={styles.buttonText}>REGISTER</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.buttonStyles}
            onPress={() => this.props.navigate('SettingsRT')}>
            <Text style={styles.buttonText}>SETTINGS</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonStyles}
            onPress={() => this.props.navigate('AboutRT')}>
            <Text style={styles.buttonText}>ABOUT</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 6,
    backgroundColor: '#ffffff',
  },
  buttonRow: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#000000',
    borderBottomWidth: 1,
  },
  buttonStyles: {
    backgroundColor: '#ffffff',
    width: '50%',
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
  },
};
