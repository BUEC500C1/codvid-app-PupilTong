import React from 'react';
import {
  Platform,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
  Switch,
  Image,
} from 'react-native';
import { PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';
import ViewsAsMarkers from './ViewsAsMarkers';
const IOS = Platform.OS === 'ios';
const ANDROID = Platform.OS === 'android';



type Props = {};
export default class App extends React.Component<Props> {
  constructor(props) {
    super(props);

    this.state = {
      Component: null,
      useGoogleMaps: ANDROID,
      covidInfo : null
    };

  }
  



  render() {
    //const { Component, useGoogleMaps } = this.state;
    const useGoogleMaps = true;
    return (
      <View style={styles.container}>
        {ViewsAsMarkers && (
          <ViewsAsMarkers
            provider={useGoogleMaps ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  ImageIconStyle: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode: 'stretch',
  },
  googleSwitch: { marginBottom: 10 },
});