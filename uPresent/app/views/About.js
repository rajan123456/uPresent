import React from "react";
import { StyleSheet, Text, ScrollView, Image, View } from "react-native";

const aboutUPresent =
  "This is the best app in the world and it will identify your face and help you record your attendance.";

const whatIsUPresent =
  "This app is made by students to help students to record their attendance. No cheating though, we use a geo-fence to ensure that you are actually attending your classes";

export class About extends React.Component {
  static navigationOptions = {
    header: null
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.containerImage}>
          <Image
            style={styles.pics}
            source={require("../sections/img/uPresent_Logo.png")}
          />
        </View>
        <Text style={styles.aboutTitle}>Who We Are</Text>
        <Text style={styles.aboutText}>{aboutUPresent}</Text>
        <Text style={styles.aboutTitle}>What We Do</Text>
        <Text style={styles.aboutText}>{whatIsUPresent}</Text>
        <Text
          onPress={() => this.props.navigation.goBack()}
          style={styles.backButton}
        >
          GO BACK
        </Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 30,
    backgroundColor: "#ffffff"
  },
  containerImage: {
    justifyContent: "center",
    alignItems: "center"
  },
  pics: {
    height: 200
  },
  aboutTitle: {
    paddingTop: 10,
    textAlign: "center"
  },
  aboutText: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    textAlign: "center"
  },
  backButton: {
    paddingBottom: 50,
    textAlign: "center"
  }
});
