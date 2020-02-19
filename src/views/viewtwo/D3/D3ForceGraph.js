/*global browser*/
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
import DomainLookUpError from "./domainlookup/DomainLookUpError";
import DomainLookUpResult from "./domainlookup/DomainLookUpResult";

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
        lookUpDomainResult: null,
        message: null
    };

    componentDidMount() {
        this.getValues();
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
            if (node.id.toLowerCase() === this.state.searchBarText.toLowerCase()) {
                if (!this.state.searchedNodes.includes(node.id)) {
                    this.state.searchedNodes.push(node.id);
                }
                resultFound = true;
            }
        });

        if (!resultFound && !this.state.failedSearches.includes(this.state.searchBarText)) {
            this.state.failedSearches.push(this.state.searchBarText);
            this.createFailedSearchResults();
        } else {
            this.createSearchResults();
        }

    };

    removeNodeHighlight = (id) => {
        this.state.searchedNodes.forEach(node => {
            if (node === id) {
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

    handleResponse = (message) => {
        this.setState({message: message});
        this.getTrackedWebsite();
    };

    handleError = (error) => {
        console.log(`Error: ${error}`);
    };

    getValues = (e) => {
        const sending = browser.runtime.sendMessage({});
        sending.then(this.handleResponse, this.handleError);
    };

    getTrackedWebsite = () => {
        let message = this.state.message;
        let myJson = {nodes: [], links: []};

        if (message != null) {
            if (this.state.showOnlyParentCompanies) {
                for (let domain of message["allDomainsForParentCompanyView"]) {
                    if (domain != null) {
                        if (message["onlyParentCompanyTrackers"].has(domain)) {
                            myJson["nodes"].push({
                                "id": domain,
                                "size": message["onlyParentCompanyTrackers"].get(domain).size
                            })
                        } else {
                            myJson["nodes"].push({
                                "id": domain,
                                "size": 0
                            })
                        }
                    }
                }

                for (let [key, value] of message["onlyParentCompanyTrackers"]) {
                    for (let v of value) {
                        if (v != null) {
                            myJson["links"].push({
                                "source": v,
                                "target": key
                            })
                        }
                    }
                }
            } else {
                for (let domain of message["allDomains"]) {
                    if (domain != null) {
                        if (message["allTrackers"].has(domain)) {
                            myJson["nodes"].push({
                                "id": domain,
                                "size": message["allTrackers"].get(domain).size
                            })
                        } else {
                            myJson["nodes"].push({
                                "id": domain,
                                "size": 0
                            })
                        }
                    }
                }

                for (let [key, value] of message["allTrackers"]) {
                    for (let v of value) {
                        if (v != null) {
                            myJson["links"].push({
                                "source": v,
                                "target": key
                            })
                        }
                    }
                }
            }
        }
        console.log(myJson);
        this.setState({result: myJson});
    };

    lookUpDomain = (node) => {
        let jsonBody = JSON.stringify({
            domainName: node.id
        });

        fetch("https://server.webtrackinganalyser.com/getDomainInformation", {
            method: 'POST',
            dataType: 'json',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: jsonBody
        }).then(response => response.json())
            .then(data => this.setState({lookUpDomainResult: data}));
    };

    _handleKeyDown = (event) => {
        const ENTER_KEY = 13;
        if (event.keyCode === ENTER_KEY) {
            this.highLightNode();
        }
    };

    createSearchResults = () => {
        this.setState({searchBoxes: []});
        let results = [];
        this.state.searchedNodes.forEach(node => {
            results.push(<SearchBoxResult companyName={node} removeSearch={this.removeNodeHighlight}/>)
        });
        this.setState({searchBoxes: results});
    };

    createFailedSearchResults = () => {
        this.setState({
            failedSearchResults: this.state.failedSearches.map((id) =>
                <NoSearchResult key={id} failedSearchResult={id} removeFailedResult={this.removeFailedSearch}/>
            )
        })
    };

    displayDomainSearchResult = () => {
        if (this.state.lookUpDomainResult !== null) {
            let result = this.state.lookUpDomainResult;
            if (result["domainPresent"] === true) {
                return <DomainLookUpResult domain={result["domain"]} parentCompany={result["parentCompany"]}
                                           domainInfo={result["information"]}/>
            } else {
                return <DomainLookUpError domain={result["domain"]}/>
            }
        }
    };

    render() {
        if (this.state.result === null) {
            return Loading();
        } else {
            return (
                <>
                    <h1> Website trackers visualisation: </h1>
                    <Button size="small" color="secondary" onClick={this.getValues}>
                        Refresh graph
                    </Button>
                    <br/>
                    {this.switchButton()}
                    <br/>
                    {this.changeNodeSize()}
                    <br/>
                    <div className="forceGraphGrid">
                        <div/>
                        <Graph result={this.state.result}
                               searchedNodes={this.state.searchedNodes}
                               displayNodeSizeByNumberOfOccurrences={this.state.displayNodeSizeByNumberOfOccurrences}
                               lookUpDomain={this.lookUpDomain}
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
                            {this.displayDomainSearchResult()}
                        </div>
                    </div>
                </>
            );
        }
    }
}

export default D3ForceGraph;