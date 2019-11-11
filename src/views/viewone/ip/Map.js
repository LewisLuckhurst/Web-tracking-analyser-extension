import {GoogleMap, withGoogleMap, withScriptjs} from "react-google-maps";
import React  from 'react';
import { Marker } from "react-google-maps";

const Map = withScriptjs(withGoogleMap((props) => {

        return (
            <GoogleMap
                defaultZoom={14}
                center={{lat: props.late, lng: props.long}}>
                <Marker
                    position={{lat: props.late, lng: props.long}}>
                </Marker>
            </GoogleMap>
        );
    }
));
export default Map;