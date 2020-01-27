import React, {Component} from 'react';
import "./DomainLookUpResult.css"

class DomainLookUpResult extends Component {

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div className="resultBox">
                <h3>Showing info about: <div className="redText"> {this.props.domain} </div></h3>

                <div className="mainBodyText">
                    <p><b>Parent company:</b> {this.props.parentCompany}</p>
                    <p><b>Information:</b> {this.props.domainInfo}</p>
                </div>
            </div>
        );
    }
}

export default DomainLookUpResult;