/*global window UAParser*/
import React, {Component} from 'react';
import "./UserAgent.css";
import UAParser from "ua-parser-js";

class UserAgent extends Component {

    render() {
        let uastring = navigator.userAgent;
        console.log(uastring);
        let parser = new UAParser();
        parser.setUA(uastring);
        let result = parser.getResult();
        return (
        // var c = ((a < b) ? 'minor' : 'major');
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
                        <p>{result.browser.name === undefined ? "Not found" : result.browser.name}</p>
                        <p>{result.browser.version === undefined ? "Not found" : result.browser.version}</p>
                        <p>{result.device.type === undefined ? "Not found" : result.device.type}</p>
                        <p>{result.device.vendor === undefined ? "Not found" : result.device.vendor}</p>
                        <p>{result.device.model === undefined ? "Not found" : result.device.model}</p>
                        <p>{result.os.name === undefined ? "Not found" : result.os.name}</p>
                        <p>{result.os.version === undefined ? "Not found" : result.os.version}</p>
                        <p>{window.screen.availWidth+'x'+window.screen.availHeight}</p>
                    </div>
                </div>
            </>
        )
    }
}

export default UserAgent;