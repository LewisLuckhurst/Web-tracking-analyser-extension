import React, {Component} from 'react';
import "./IpTracking.css";

class IpTracking extends Component {

    render() {
        return (
            <>
                <h3> Info gathered from IP address: </h3>
                <div className="table">
                    <div className="secondColumn">
                        <p>Ip Address:</p>
                        <p>Continent Name:</p>
                        <p>Country Name:</p>
                        <p>City:</p>
                        <p>Post code:</p>
                        <p>ISP:</p>
                        <p>Calling code:</p>
                        <p>Languages:</p>
                    </div>
                    <div className="thirdColumn">
                        <p>{this.props.result["ip"]}</p>
                        <p>{this.props.result["continent_code"]}</p>
                        <p>{this.props.result["country_name"]}</p>
                        <p>{this.props.result["city"]}</p>
                        <p>{this.props.result["postal"]}</p>
                        <p>{this.props.result["org"]}</p>
                        <p>{this.props.result["country_calling_code"]}</p>
                        <p>{this.props.result["languages"]}</p>
                    </div>
                </div>
            </>
        )
    }
}

export default IpTracking;