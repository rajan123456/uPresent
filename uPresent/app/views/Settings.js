import React from 'react';
import {Image, Text, View} from 'react-native';
import SettingsList from 'react-native-settings-list';

export class Settings extends React.Component {
  constructor() {
    super();
    this.onValueChange = this.onValueChange.bind(this);
    this.state = {switchValue: false};
  }

  onValueChange(value) {
    this.setState({switchValue: value});
  }

  render() {
    return (
      <View style={styles.containerViewStyle}>
        <View style={styles.headerViewStyle}>
          <Text style={styles.headerTextStyle}>Settings</Text>
        </View>
        <View style={styles.containerViewStyle}>
          <SettingsList borderColor="#c8c7cc" defaultItemSize={50}>
            <SettingsList.Header headerStyle={styles.settingsListHeaderStlye} />
            <SettingsList.Item
              icon={
                <Image
                  style={styles.imageStyle}
                  source={require('../sections/img/video.png')}
                />
              }
              hasSwitch={true}
              switchState={this.state.switchValue}
              switchOnValueChange={this.onValueChange}
              hasNavArrow={false}
              title="Video Registration"
            />
          </SettingsList>
        </View>
      </View>
    );
  }
}

const styles = {
  containerViewStyle: {backgroundColor: '#EFEFF4', flex: 1},
  imageStyle: {
    marginLeft: 15,
    alignSelf: 'center',
    height: 30,
    width: 30,
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
  settingsListHeaderStlye: {
    marginTop: 15,
  },
};
