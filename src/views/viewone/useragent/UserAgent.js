/*global window*/
import React, {Component} from 'react';
import "./UserAgent.css";

class UserAgent extends Component {

    render() {
        return (
            <>
                <h3>Info Gathered from user agent:</h3>
                <div className="table">
                    <div className="secondColumn">
                        <p>Browser Name:</p>
                        <p>Browser Version:</p>
                        <p>Device Type:</p>
                        <p>Device Maker:</p>
                        <p>Device Name:</p>
                        <p>Operating System:</p>
                        <p>Operating System version:</p>
                        <p>Screen resolution:</p>
                    </div>
                    <div className="thirdColumn">
                        <p>{this.props.result["agentName"]}</p>
                        <p>{this.props.result["agentVersion"]}</p>
                        <p>{this.props.result["deviceClass"]}</p>
                        <p>{this.props.result["deviceBrand"]}</p>
                        <p>{this.props.result["deviceName"]}</p>
                        <p>{this.props.result["operatingSystemName"]}</p>
                        <p>{this.props.result["operatingSystemNameVersion"]}</p>
                        <p>{window.screen.availWidth+'x'+window.screen.availHeight}</p>
                    </div>
                </div>
            </>
        )
    }
}

export default UserAgent;