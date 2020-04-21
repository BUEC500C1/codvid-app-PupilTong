import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image
} from 'react-native';
import MapView, { Marker, ProviderPropType } from 'react-native-maps';
import PriceMarker from './PriceMarker';
import { StackedAreaChart,Grid,YAxis,XAxis  } from 'react-native-svg-charts'
import * as shape from 'd3-shape'
import DatePicker from 'react-native-date-picker'

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -100.4324;
const LATITUDE_DELTA = 30;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class ViewsAsMarkers extends React.Component {
  covidLive = [
    {
      month: new Date(2015, 0, 1),
      Confirmed: 0,
      Deaths: 0,
      Recovered: 0,
      Active: 0,
    },
    {
      month: new Date(2015, 0, 2),
      Confirmed: 0,
      Deaths: 0,
      Recovered: 0,
      Active: 0,
    },
    {
      month: new Date(2015, 0, 3),
      Confirmed: 0,
      Deaths: 0,
      Recovered: 0,
      Active: 0,
    },
    {
      month: new Date(2015, 0, 4),
      Confirmed: 0,
      Deaths: 0,
      Recovered: 0,
      Active: 0,
    },
  ];
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
      currentViewLocation:null,
      showDetailedWindow:false,
      DetaileWindowCountry:null,
      DetaileWindowDate:new Date(Date.now()),
      covidinfo:null,
      worldinfo:null,
    };
    countryCode = null;
    selection = ["NewConfirmed","TotalConfirmed","NewDeaths","TotalDeaths","NewRecovered","TotalRecovered"]
    fetch("https://gist.githubusercontent.com/sindresorhus/1341699/raw/84704529d9ee4965df2cddc55e5f2bc3dc686950/countrycode-latlong-array.json").then((r)=>{
      r.json().then((json)=>{
        countryCode=json;
      })
    }).done();
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
              return{
                covidinfo: jobject["Countries"],
                worldinfo: jobject["Global"]
              }
            })
          })
        }
      }
    )
  }
  markerClickHandler(setCountry,me){
    if(setCountry!=null){
      me.setState(()=>{
        return {
          showDetailedWindow:true,
          DetaileWindowCountry:setCountry["Slug"]
        }
      })
    }else{//for world live
    }
  }
  DetailWindowRender(){
    if(!this.state.showDetailedWindow){
      return
    }else{
      const To = new Date(this.state.DetaileWindowDate);
      if(To.getDate()>=(new Date(Date.now()).getDate()))To.setDate(new Date(Date.now()).getDate() - 1)
      const From = new Date(To);
      From.setDate(From.getDate() - 7);
      const country = this.state.DetaileWindowCountry;
      
      fetch('https://api.covid19api.com/country/'+ country +'?from=' + From.toISOString() + '&to=' + To.toISOString()).then((r)=>{
        if(r.ok){

          this.covidLive = [
            {
              month: new Date(2015, 0, 1),
              Confirmed: 0,
              Deaths: 0,
              Recovered: 0,
              Active: 0,
            },
            {
              month: new Date(2015, 0, 2),
              Confirmed: 0,
              Deaths: 0,
              Recovered: 0,
              Active: 0,
            },
            {
              month: new Date(2015, 0, 3),
              Confirmed: 0,
              Deaths: 0,
              Recovered: 0,
              Active: 0,
            },
            {
              month: new Date(2015, 0, 5),
              Confirmed: 0,
              Deaths: 0,
              Recovered: 0,
              Active: 0,
            },
            {
              month: new Date(2015, 0, 6),
              Confirmed: 0,
              Deaths: 0,
              Recovered: 0,
              Active: 0,
            },
            {
              month: new Date(2015, 0, 7),
              Confirmed: 0,
              Deaths: 0,
              Recovered: 0,
              Active: 0,
            },
            {
              month: new Date(2015, 0, 8),
              Confirmed: 0,
              Deaths: 0,
              Recovered: 0,
              Active: 0,
            },
          ];
          r.json().then((j)=>{
            for(var index=0;index<j.length;index++){
              var value = j[index];
              var day = (new Date(value["Date"])).getDate() - From.getDate()
              if(day<0 || day >6){console.log(day);continue;}
              this.covidLive[day].month = From.getDate() + day;
              this.covidLive[day].Confirmed += value["Confirmed"];
              this.covidLive[day].Deaths += value["Deaths"];
              this.covidLive[day].Recovered += value["Recovered"];
              this.covidLive[day].Active += value["Active"];
            }
          })
        }
      }).done();
      
      console.log(this.covidLive)
      

      const colors = ['#0779e4', '#4cbbb9', '#77d8d8', '#eff3c6']
      const keys = ['Confirmed', 'Deaths', 'Recovered', 'Active']
      const axisSvg = {
        fontSize: 12,
        fill: 'black',
        stroke: 'gray',
        strokeWidth: 0.1,
      }

      return (
        <View style={styles.DetaileWindow}>
          <TouchableOpacity style={styles.back} onPress={()=>{this.setState(()=>{return {showDetailedWindow:false}})}}>
            <Text style={styles.ImageIconStyle}>x</Text>
          </TouchableOpacity>
          <View style={styles.chartContainer}>
            <StackedAreaChart
                    style={{ height:'100%',width:'100%' }}
                    data={this.covidLive }
                    keys={keys}
                    colors={colors}
                    curve={shape.curveNatural}
                    showGrid={true}
              >
              
              </StackedAreaChart>
              <YAxis
                style={ { position: 'absolute', top: 0, bottom: 0 }}
                data={ StackedAreaChart.extractDataPoints(this.covidLive , keys) }
                contentInset={ { top: 10, bottom: 10 } }
                svg={ axisSvg }
                />
                <XAxis
                  style={ { marginVertical:5,}}
                  data={ this.covidLive }
                  contentInset={ { top: 10, bottom: 10,left: 10, right:10 } }
                  svg={ axisSvg }
                  />
          </View>
          <Text style={{
            fontSize:20,
            position:"absolute",
            top:'65%',
            marginHorizontal:20
          }}>
            Set the last date
            </Text>
          <DatePicker
            style={{
              position:"absolute",
              top:'70%',
              width:Dimensions.get('window').width,
            }}
            date={this.state.DetaileWindowDate}
            mode="date"
            onDateChange={(e)=>{this.setState(()=>{return {DetaileWindowDate : new Date(e)}})}}
            />
        </View>
      )
    }
  }
  rendermarker(){
    const covidinfo = this.state?.covidinfo;
    var count = 0;
    if(covidinfo){
      const selected = this.state.selectionIndex;
      const currentViewLocation = this.state.currentViewLocation;
      const markerClickHandler = this.markerClickHandler;
      const me =this;
      return(
        covidinfo.map(
          function(countryInfo,index){
            
            if(count>20){
              if(Math.random()>0.5)return;
            }
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
                  return (
                    <Marker key={index} coordinate={locProp} onPress={()=>{markerClickHandler(countryInfo,me)}} > 
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
        
        <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={()=>{this.setState(()=>{return{selectionIndex:0}})}}
              style={[styles.bubble, styles.button]}>
              <Text style={styles.ammountButton}>{selection[0]}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={()=>{this.setState(()=>{return{selectionIndex:1}})}}
              style={[styles.bubble, styles.button]}>
              <Text style={styles.ammountButton}>{selection[1]}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={()=>{this.setState(()=>{return{selectionIndex:2}})}}
              style={[styles.bubble, styles.button]}>
              <Text style={styles.ammountButton}>{selection[2]}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={()=>{this.setState(()=>{return{selectionIndex:3}})}}
              style={[styles.bubble, styles.button]}>
              <Text style={styles.ammountButton}>{selection[3]}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={()=>{this.setState(()=>{return{selectionIndex:4}})}}
              style={[styles.bubble, styles.button]}>
              <Text style={styles.ammountButton}>{selection[4]}</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.bottomInfo}>
          <Text style={{fontSize:15}}>World Summary:{selection[this.state.selectionIndex]} {this.state.worldinfo?this.state.worldinfo[selection[this.state.selectionIndex]]:null}</Text>
        </View>
        
        <TouchableOpacity style={styles.back} onPress={() => this.clickfreshButton()}>
          <Image
            source={require('./baseline_refresh_black_18dp.png')}
            style={styles.ImageIconStyle}/>
        </TouchableOpacity>
        {this.DetailWindowRender()}
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
  button: {
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  back: {
    position: 'absolute',
    top: 20,
    left: 12,
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 20,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    position:"absolute",
    top:10,
    right:10,
    width: 150,
    backgroundColor: 'transparent',
  },
  bottomInfo:{
    paddingHorizontal: 12,
    marginHorizontal:10,
    backgroundColor:'rgba(255,255,255,0.7)'
  },
  DetaileWindow:{
    position:"absolute",
    padding:50,
    left:0,
    width:'100%',
    height :'98%',
    backgroundColor:'#FFF',
    zIndex:0
  },
  
  chartContainer:{
    position:"absolute",
    top:'15%',
    width: Dimensions.get('window').width-40,
    height :'40%',
    marginHorizontal:20
  },
  ammountButton: { fontSize: 10 },
  summaryButton: { fontSize: 15 ,color:'red'},
});

export default ViewsAsMarkers;
