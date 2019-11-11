import {GoogleMap, Marker, withGoogleMap, withScriptjs} from "react-google-maps";
import React from 'react';

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