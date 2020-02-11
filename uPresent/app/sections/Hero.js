import React from 'react';
import {Image} from 'react-native';

export class Hero extends React.Component {
  render() {
    return (
      <Image style={styles.heroImage} source={require('./img/uPresent.jpg')} />
    );
  }
}

const styles = {
  heroImage: {
    width: undefined,
    height: undefined,
    flex: 8,
  },
};
