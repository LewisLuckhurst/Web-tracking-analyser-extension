import React, {Component} from 'react';
import './App.css';
import IpTracking from "./ip/IpTracking";
import IpTrackingMap from "./ip/IpTrackingMap";
import UserAgent from "./useragent/UserAgent";

class App extends Component {

    state = {
        result: null
    };

    async getInformationFromIp() {
        let ip = await this.getIp();
        let jsonBody = JSON.stringify({
            ip: ip
        });

        fetch("http://localhost:8080/tracking", {
            method: 'POST',
            dataType: 'json',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: jsonBody
        }).then(response => response.json())
            .then(data => this.setState({result: data}));
    };

    async getIp() {
        let result = await fetch("https://api.ipgeolocation.io/getip")
            .then(response => response.json());

        return result["ip"];
    };

    render() {
        this.getInformationFromIp();
        if (this.state.result === null) {
            return null;
        }
        return (
            <div className="App">
                <h1>Information that could be tracked:</h1>
                <div className="wrapper">
                    <div className="block">
                        <IpTracking result={this.state.result}/>
                    </div>

                    <div className="block">
                        <UserAgent result={this.state.result}/>
                    </div>
                </div>
                <h1>Location based on IP address:</h1>
                <div className="wrapper">
                    <div className="mapContainer">
                        <IpTrackingMap result={this.state.result}/>
                    </div>
                </div>
                <br/>
            </div>
        );
    }
}

export default App;
