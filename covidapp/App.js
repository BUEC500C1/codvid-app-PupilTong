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

    this.clickfreshButton();
  }
  

  clickfreshButton(){
    fetch('https://api.covid19api.com/summary',{
      method:'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(
      (response)=>{
        if(response.status==200){
          response.json().then((jobject)=>{
            this.setState(()=>{
              return{covidInfo: jobject["Countries"]}
            })
          })
        }
      }
    )
  }
  renderBackButton() {
    return (
      <TouchableOpacity
        style={styles.back}
        onPress={() => this.clickfreshButton()}
      >
        <Image
          source={require('./baseline_refresh_black_18dp.png')}
          style={styles.ImageIconStyle}
        />
      </TouchableOpacity>
    );
  }


  render(examples) {
    examples = [
      // [<component>, <component description>, <Google compatible>, <Google add'l description>]
      [ViewsAsMarkers, 'Arbitrary Views as Markers', true],
    ]
    //const { Component, useGoogleMaps } = this.state;
    const useGoogleMaps = true;
    const covid = this.state.covidInfo;
    return (
      <View style={styles.container}>
        {ViewsAsMarkers && (
          <ViewsAsMarkers
            provider={useGoogleMaps ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
            covidinfo = {covid}
          />
        )}
        {ViewsAsMarkers && this.renderBackButton()}
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
  button: {
    flex: 1,
    marginTop: 10,
    backgroundColor: 'rgba(220,220,220,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  back: {
    position: 'absolute',
    top: 20,
    left: 12,
    backgroundColor: 'rgba(255,255,255,0.4)',
    padding: 12,
    borderRadius: 20,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
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