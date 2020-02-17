import Map from "./Map";
import React, {Component} from 'react';


class IpTrackingMap extends Component {

    render() {
        return (
            <Map
                googleMapURL={`https://server.webtrackinganalyser.com/map`}
                loadingElement={<div style={{height: `100%`}}/>}
                containerElement={<div style={{height: `600px`, width: `100%`}}/>}
                mapElement={<div style={{height: `100%`}}/>}
                late={parseFloat(this.props.result["latitude"])}
                long={parseFloat(this.props.result["longitude"])}
            />
        );
    }
}

export default IpTrackingMap