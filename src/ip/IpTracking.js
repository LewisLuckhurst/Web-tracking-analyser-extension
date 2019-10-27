import React, {Component} from 'react';
import "./IpTracking.css";

class IpTracking extends Component {

    render() {
        return (
            <>
                <div className="table">
                    <div className="secondColumn">
                        <p>Ip Address:</p>
                        <p>Continent Name:</p>
                        <p>Country Name:</p>
                        <p>City:</p>
                        <p>Post code:</p>
                        <p>ISP:</p>
                    </div>
                    <div className="thirdColumn">
                        <p>{this.props.result["ip"]}</p>
                        <p>{this.props.result["continentName"]}</p>
                        <p>{this.props.result["countryName"]}</p>
                        <p>{this.props.result["city"]}</p>
                        <p>{this.props.result["postCode"]}</p>
                        <p>{this.props.result["isp"]}</p>
                    </div>
                </div>
            </>
        )
    }
}

export default IpTracking;