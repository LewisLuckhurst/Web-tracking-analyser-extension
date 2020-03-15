import React, {Component} from 'react';
import { Map, Marker, TileLayer } from "react-leaflet";
import "./IpTrackingMap.css"

class IpTrackingMap extends Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        const position = [this.props.result["latitude"], this.props.result["longitude"]];
        return (
            <Map center={[this.props.result["latitude"], this.props.result["longitude"]]} zoom={12}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={position}/>
            </Map>
        );
    }
}

export default IpTrackingMap