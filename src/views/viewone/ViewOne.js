import React, {Component} from 'react';
import './ViewOne.css';
import IpTracking from "./ip/IpTracking";
import UserAgent from "./useragent/UserAgent";
import Loading from "../../loading/LoadingBar";
import IpTrackingMap from "./ip/IpTrackingMap";

class ViewOne extends Component {

    state = {
        result: null,
        ip: null
    };

    componentDidMount() {
        this.getInformationFromIp();
    }

    getInformationFromIp = () => {
        fetch("https://api.ipgeolocation.io/getip")
            .then(response => response.json())
            .then(data => {
                    let
                        jsonBody = JSON.stringify({
                            ip: data["ip"]
                        });

                    fetch("https://server.webtrackinganalyser.com/tracking", {
                        method: 'POST',
                        dataType: 'json',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: jsonBody
                    }).then(response => response.json())
                        .then(data => this.setState({result: data}));
                }
            );
    };

    render() {
        if (this.state.result === null) {
            return Loading();
        }
        return (
            <>
                <h1>Information that could be tracked:</h1>
                <div className="wrapper">
                    <div className="block">
                        <IpTracking result={this.state.result}/>
                    </div>

                    <div className="block">
                        <UserAgent result={this.state.result}/>
                    </div>
                </div>
                <h1>Location based on IP address: </h1>
                <div className="wrapper">
                    <div className="mapContainer">
                        <IpTrackingMap result={this.state.result}/>
                    </div>
                </div>
                <br/>
            </>
        );
    }
}

export default ViewOne;