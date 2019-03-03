import { 
    View,
    Text,
    StyleSheet,
    TouchableHighlight
} from 'react-native'
import React, { Component } from 'react';

import { Navigation } from 'react-native-navigation';
import GeolocationAPI from 'react-native-geolocation-service';

import { config } from '../helpers/config';

class Geolocation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            coords: {
                latitude: null,
                longitude: null
            },
            nearby: []
        }
    }
    
    componentDidMount() {
        GeolocationAPI.getCurrentPosition(
            (position) => {
                console.log(position)
                this.setState({
                    coords: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }
                });
                this.getInformationFromCoords(position.coords.latitude, position.coords.longitude)
            },
            (error) => {
                // See error code charts below.
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }

    getInformationFromCoords(lat, lon) {
        fetch(`https://api.tmb.cat/v1/maps/wfs?REQUEST=GetFeature&SERVICE=WFS&TYPENAME=ELEMENTS_SUPERFICIE&VERSION=1.1.0&app_id=${config.appId}&app_key=${config.apiKey}&cql_filter=(+(CODI_TIPUS%3D1)+OR+(CODI_TIPUS%3D2)+)&outputFormat=json&sortBy=DISTANCE_IN_METERS&srsName=EPSG:3857&viewparams=P_LON:${lon};P_LAT:${lat};P_DIST:200`)
            .then(data => data.json())
            .then((bus) => {
                this.setState({
                    nearby: bus.features
                })
            })
    }

    renderParadas(data) {
        return data.map((el, k) => {
            return (
                <View key={k}>
                    <Text>{el.properties.NOM} ({el.properties.CODI})</Text>
                    <Text>{Math.round(el.properties.DISTANCE_IN_METERS)} metres</Text>
                </View>
            )
        })
    }
    
    render() {
        console.log(this.state.nearby)
        return (
            <View style={styles.container}>
                {this.state.nearby.length > 0 ? this.renderParadas(this.state.nearby) : null}
                <TouchableHighlight onPress={() => Navigation.dismissModal(this.props.componentId)}>
                    <Text>Dismiss</Text>
                </TouchableHighlight>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})

export default Geolocation;