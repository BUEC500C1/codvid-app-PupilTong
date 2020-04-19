import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker, ProviderPropType } from 'react-native-maps';
import PriceMarker from './PriceMarker';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -100.4324;
const LATITUDE_DELTA = 30;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class ViewsAsMarkers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },      
      selectionIndex : 1,
      currentViewLocation:null
    };
    countryCode = null;
    selection = ["NewConfirmed","TotalConfirmed","NewDeaths","TotalDeaths","NewRecovered","TotalRecovered"]
    fetch("https://gist.githubusercontent.com/sindresorhus/1341699/raw/84704529d9ee4965df2cddc55e5f2bc3dc686950/countrycode-latlong-array.json").then((r)=>{
      r.json().then((json)=>{
        countryCode=json;
      })
    }).done();
  }
  rendermarker(){
    var count = 0;
    if(this.props.covidinfo){
      const selected = this.state.selectionIndex;
      const currentViewLocation = this.state.currentViewLocation;
      return(
        this.props.covidinfo.map(
          function(countryInfo,index){
            var location = countryCode[countryInfo["CountryCode"].toLowerCase()];
            if(location){
              var number = parseInt(countryInfo[selection[selected]]);
              locProp = {
                latitude: parseFloat(location[0]),
                longitude: parseFloat(location[1]),
              }
              var distance = 0
              if(currentViewLocation){//not null
                distance =  Math.abs(parseFloat(currentViewLocation["latitude"]) - locProp.latitude) 
                + Math.abs(parseFloat(currentViewLocation["longitude"]) - locProp.longitude) ;
              }
              else{
                distance =  Math.abs(LATITUDE - locProp.latitude) + Math.abs(LONGITUDE - locProp.longitude) ;
              }
              if(distance<25){
                  count++;
                  if(count>10){
                    if(Math.random()<(distance/15))return;
                  }
                  return (
                    <Marker key={index} coordinate={locProp}>
                      <PriceMarker amount={number} />
                    </Marker>
                  )
              }
            }
          }
        )
      );
    }
  }
  render() {
    
    const selected = this.selectionIndex;
    return (
      <View style={styles.container}>
        <MapView
          provider={this.props.provider}
          style={styles.map}
          initialRegion={this.state.region}
          onRegionChangeComplete={(stat)=>{
            this.setState(()=>{
              return{currentViewLocation: stat}
            })
          }}
        >
          {this.rendermarker()}
        </MapView>
      </View>
    );
  }
}

ViewsAsMarkers.propTypes = {
  provider: ProviderPropType,
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  ammountButton: { fontSize: 20, fontWeight: 'bold' },
});

export default ViewsAsMarkers;
