import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";

export class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoggedIn: false };
  }

  toggleUser = () => {
    this.setState(previousState => {
      return { isLoggedIn: !previousState.isLoggedIn };
    });
  };

  render() {
    let display = this.state.isLoggedIn ? "Sample User" : this.props.message;
    return (
      <View style={styles.headStyle}>
        <Image
          style={styles.logoStyle}
          source={require("./img/uPresent_Logo.png")}
        />
        <Text style={styles.headText} onPress={this.toggleUser}>
          {display}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headText: {
    paddingTop: 10,
    textAlign: "right",
    color: "#000000",
    fontSize: 20,
    flex: 1
  },
  headStyle: {
    paddingTop: 20,
    paddingRight: 10,
    backgroundColor: "#ffffff",
    flex: 1,
    flexDirection: "row",
    borderBottomWidth: 2,
    borderColor: "#ffffff"
  },
  logoStyle: {
    flex: 1,
    width: undefined,
    height: undefined
  }
});
