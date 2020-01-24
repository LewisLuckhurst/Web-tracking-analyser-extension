import React, {Component} from 'react';
import "./D3ForceGraphCss.css"
import Loading from "../../../loading/LoadingBar";
import Button from "@material-ui/core/Button";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import SearchBar from "./Search";
import SearchBoxResult from "./SearchBoxResult";
import Graph from "./graph/Graph";
import NoSearchResult from "./NoSearchResult";

class D3ForceGraph extends Component {

    state = {
        data: null,
        result: null,
        height: 0,
        width: 0,
        searchedNodes: [],
        failedSearches: [],
        showOnlyParentCompanies: false,
        searchBarText: "",
        searchBoxes: [],
        failedSearchResults: [],
        displayNodeSizeByNumberOfOccurrences: false,
    };

    componentDidMount() {
        this.getTrackedWebsite();
        document.addEventListener("keydown", this._handleKeyDown);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this._handleKeyDown);
    }

    handleChange = (event) => {
        this.setState({showOnlyParentCompanies: event.target.checked}, this.getTrackedWebsite);
    };

    handleChange2 = (event) => {
        this.setState({displayNodeSizeByNumberOfOccurrences: event.target.checked}, this.getTrackedWebsite);
    };

    updateSearchBarText = (text) => {
        this.setState({searchBarText: text.target.value});
    };

    switchButton = () => {
        return (
            <div className="switch">
                <FormGroup row>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={this.state.showOnlyParentCompanies}
                                onChange={this.handleChange}
                                value="checkedB"
                                color="secondary"
                            />
                        }
                        label="Only show parent companies"
                    />
                </FormGroup>
            </div>
        )
    };

    changeNodeSize = () => {
        return (
            <div className="switch">
                <FormGroup row>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={this.state.displayNodeSizeByNumberOfOccurrences}
                                onChange={this.handleChange2}
                                value="checkedB"
                                color="secondary"
                            />
                        }
                        label="Show node size based on number of occurrences"
                    />
                </FormGroup>
            </div>
        )
    };

    highLightNode = () => {
        let resultFound = false;
        this.state.result.nodes.forEach(node => {
            if (node.id === this.state.searchBarText) {
                if (!this.state.searchedNodes.includes(node)) {
                    this.state.searchedNodes.push(node);
                    resultFound = true;
                }
            }
        });

        if(!resultFound && !this.state.failedSearches.includes(this.state.searchBarText)){
            this.state.failedSearches.push(this.state.searchBarText);
            this.createFailedSearchResults();
        }

        this.createSearchResults();
    };

    removeNodeHighlight = (id) => {
        this.state.searchedNodes.forEach(node => {
            if (node.id === id) {
                let index = this.state.searchedNodes.indexOf(node);
                delete this.state.searchedNodes [index];
            }
        });
        this.createSearchResults();
    };

    removeFailedSearch = (id) => {
        this.state.failedSearches.forEach(failedSearchId => {
            if (failedSearchId === id) {
                let index = this.state.failedSearches.indexOf(failedSearchId);
                delete this.state.failedSearches [index];
            }
        });
        this.createFailedSearchResults();
    };

    getTrackedWebsite = () => {
        let jsonBody = JSON.stringify({
            showOnlyParentCompanies: this.state.showOnlyParentCompanies
        });

        fetch("http://localhost:8080/getDomains", {
            method: 'POST',
            dataType: 'json',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: jsonBody
        }).then(response => response.json())
            .then(data => this.setState({result: data})
            );
    };

    _handleKeyDown = (event) => {
        const ESCAPE_KEY = 13;
        if (event.keyCode === ESCAPE_KEY) {
            this.highLightNode();
        }
    };

    createSearchResults = () => {
        this.setState({searchBoxes: []});
        let results = [];
        this.state.searchedNodes.forEach(node => {
            results.push(<SearchBoxResult companyName={node.id} removeSearch={this.removeNodeHighlight}/>)
        });
        this.setState({searchBoxes: results});
    };

    createFailedSearchResults = () => {
        this.setState({failedSearchResults: this.state.failedSearches.map((id) =>
            <NoSearchResult key={id} failedSearchResult={id} removeFailedResult={this.removeFailedSearch}/>
        )})
    };

    render() {
        if (this.state.result === null) {
            return Loading();
        } else {
            return (
                <>
                    <h1> Website trackers visualisation: </h1>
                    <Button size="small" color="secondary" onClick={this.getTrackedWebsite}>
                        Refresh graph
                    </Button>
                    <br/>
                    {this.switchButton()}
                    <br/>
                    {this.changeNodeSize()}
                    <br/>
                    <div className="forceGraphGrid">
                        <Graph result={this.state.result}
                               searchedNodes={this.state.searchedNodes}
                               displayNodeSizeByNumberOfOccurrences={this.state.displayNodeSizeByNumberOfOccurrences}
                        />
                        <div className="search">
                            <SearchBar
                                updateText={this.updateSearchBarText}
                                highLightNode={this.highLightNode}
                            />
                            <div className="resultContainer">
                                {this.state.failedSearchResults}
                                {this.state.searchBoxes}
                            </div>
                        </div>
                    </div>
                </>
            );
        }
    }
}

export default D3ForceGraph;