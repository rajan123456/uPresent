import React from 'react';
import {Image, Platform, ScrollView, Text, View} from 'react-native';
import {TextField} from 'react-native-material-textfield';
import {RaisedTextButton} from 'react-native-material-buttons';

const aboutUPresent =
  'uPresent is a facial-recognition based attendance recording application which ensures attendance with the help of geo-fencing.';

const whatIsUPresent =
  'This app is made by students to help students record their attendance. No cheating though, we use a geo-fence to ensure that you are actually attending your classes, and facial recognition to recognize you.';

export class About extends React.Component {
  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.headerViewStyle}>
          <Text style={styles.headerTextStyle}>About</Text>
        </View>
        <View style={styles.containerImage}>
          <Image
            style={styles.pics}
            source={require('../sections/img/uPresent_Logo.png')}
          />
        </View>
        <View style={styles.container}>
          <Text style={styles.aboutTitle}>Who We Are</Text>
          <Text style={styles.aboutText}>{aboutUPresent}</Text>
          <Text style={styles.aboutTitle}>What We Do</Text>
          <Text style={styles.aboutText}>{whatIsUPresent}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableHighlight style={styles.buttonStyle}>
            <RaisedTextButton
              onPress={() => this.props.navigation.goBack()}
              title="Back"
              color={TextField.defaultProps.tintColor}
              titleColor="white"
            />
          </TouchableHighlight>
        </View>
      </ScrollView>
    );
  }
}

const styles = {
  container: {
    margin: 8,
    marginTop: Platform.select({ios: 8, android: 32}),
    flex: 1,
  },
  buttonContainer: {
    paddingTop: 8,
    margin: 8,
  },
  containerImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pics: {
    height: 200,
  },
  aboutTitle: {
    paddingTop: 10,
    textAlign: 'center',
  },
  aboutText: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    textAlign: 'center',
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
