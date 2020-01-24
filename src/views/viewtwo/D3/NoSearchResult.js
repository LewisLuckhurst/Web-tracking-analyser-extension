import React, {Component} from 'react';
import "./NoSearchResult.css";

class SearchBoxResult extends Component {

    constructor(props) {
        super(props);
        this.removeSearch();
    }

    removeSearch = () => {
        setTimeout(() =>
                this.props.removeFailedResult(this.props.failedSearchResult)
            , 5000);
    };

    render() {
        return (
            <div className="noSearchResultBox">
                <div className="resultText">
                    <p>No search result found for {this.props.failedSearchResult}</p>
                </div>
                <div className="loadingbar"/>
                <div className="secondLoadingBar"/>
            </div>
        );
    }
}

export default SearchBoxResult;