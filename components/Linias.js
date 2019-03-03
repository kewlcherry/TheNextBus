/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Picker, TouchableHighlight} from 'react-native';

import { config } from '../helpers/config';

import { Navigation } from 'react-native-navigation';

export default class App extends Component {
  static options(passProps) {
    return {
      topBar: {
        visible: false,
        animate: false
      }
    };
  }
  constructor(props) {
    super(props);
    
    this.state = {
      language: null,
      linea: null
    }
  }

  componentDidMount() {
    this._isMounted = true;
    fetch(`https://api.tmb.cat/v1/transit/linies/bus/?app_id=${config.appId}&app_key=${config.apiKey}&cql_filter=(CODI_FAMILIA+IN+(1,3,5,6,7))&propertyName=CODI_LINIA,ID_LINIA,NOM_LINIA,DESC_LINIA,ORIGEN_LINIA,DESTI_LINIA,NOM_TIPUS_TRANSPORT,ORDRE_FAMILIA,COLOR_LINIA,COLOR_TEXT_LINIA,ID_OPERADOR`)
        .then(data => data.json())
        .then((bus) => {
            if(this._isMounted) {
              this.setState({
                linea: bus.features,
                language: bus.features[0].properties.CODI_LINIA
              })
            }
        })
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
  
  render() {
    console.log(this.props)
    const { linea } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Escull la linia de Bus</Text>
          <TouchableHighlight
            onPress={() => {
              console.log('pressed');
              Navigation.push(this.props.componentId, {
                component: {
                  name: 'Paradas',
                  passProps: {
                    id: this.state.language
                  },
                }
              });
              
            }}
          >
            <Text style={styles.confirm}>Confirmar</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.content}>
          {linea && (
          <View>
            <Picker
            selectedValue={this.state.language}
            style={{height: 50, width: 100}}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({language: itemValue})
            }>
              {this.state.linea.map((item, k) => {return <Picker.Item size={20} color="#fff" value={item.properties.CODI_LINIA} label={item.properties.NOM_LINIA} key={k}  /> })}
            </Picker>
          </View>
          )}
        </View>
        <View style={styles.searchNearbyBus}>
          <TouchableHighlight
            onPress={() => {
              console.log('pressed');
              Navigation.showModal({
                stack: {
                  children: [{
                    component: {
                      name: 'Geolocation',
                      passProps: {
                        text: 'stack with one child'
                      },
                      options: {
                        topBar: {
                          title: {
                            text: 'Parades properes'
                          }
                        }
                      }
                    }
                  }]
                }
              });
              
            }}
          >
            <Text style={styles.nearbyText}>Trobar parades</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingRight: 15,
    paddingLeft: 15,
    flex: 1,
    backgroundColor: '#1f2125',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
     color: '#2991d8',
     fontSize: 20
  },
  confirm: {
    color: 'white',
    fontSize: 12,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  searchNearbyBus: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  nearbyText: {
    fontSize: 25,
    color: 'white'
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
