import React, {Component} from 'react';
import "./DomainLookUpError.css"

class DomainLookUpError extends Component {

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div className="errorBox">
                <h1>No information found for:</h1>
                <div className="text">
                    <h1>{this.props.domain}</h1>
                </div>
            </div>
        );
    }
}

export default DomainLookUpError;