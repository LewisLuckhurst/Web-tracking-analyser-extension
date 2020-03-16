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

    reset = (e) => {
        const sending = browser.runtime.sendMessage({reset: true});
        sending.then(this.getValues())
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
        this.setState({result: myJson});
    };

    lookUpDomain = (node) => {
        let domains = {
            "2mdn": {
                "parentcompany": "Google",
                "information": "A web crawler that is owned by google"
            },
            "t": {
                "parentcompany": "Twitter",
                "information": "Twitter uses the t.co domain as part of a service to protect users from harmful activity, to provide value for the developer ecosystem, and as a quality signal for surfacing relevant, interesting Tweets."
            },
            "adnxs": {
                "parentcompany": "AppNexus",
                "information": "What does this company do?\n\nAd Server \nTechnology that delivers advertisements to websites and monitors progress and performance of ad campaigns.\n\nData Management Platform \nProvider of technology to manage collection, storage, protection, segmentation and use of online data. DMPs are also used to manage users' privacy preferences.\n\nDemand Side Platform \nTechnology provider that enables advertisers to buy ad inventory from multiple ad exchanges utilizing multiple data suppliers and auction-based bidding.\n\nMobile \nProvider of advertising services to wireless devices (phones, tablets, etc.), typically through mobile web browsers or mobile applications.\n\nSupply Side Platform \nTechnology provider that helps publishers sell ad space through multiple networks and/or exchanges and optimize ad revenue.\n\nWhat data does this company collect?\n\nData Collected \nAnonymous: Ad Views, Analytics, Browser Information, Cookie Data , Date/Time, Demographic Data, Hardware/Software Type, Interaction Data , Page Views , Serving Domains \n\nPseudonymous: IP Address, Location Based Data, Clickstream Data, Device ID \n\nPII: PII Collected via 3rd Parties, EU- IP Address, EU- Unique Device ID \n\n*Data is collected on behalf of, and owned by, client."
            },
            "googletagmanager": {
                "parentcompany": "Google",
                "information": "Google Tag Manager is a free tool that allows you manage and deploy marketing tags (snippets of code or tracking pixels) on your website (or mobile app) without having to modify the code."
            },
            "quantserve": {
                "parentcompany": "Quantcast",
                "information": "Quantserve.com creates web beacons and cookies operated by audience research and behavioural advertising company Quantcast.",
                "linkToMoreInfo": "https://www.theguardian.com/technology/2012/apr/23/quantcast-tracking-trackers-cookies-web-monitoring"
            },
            "doubleclick": {
                "parentcompany": "Google",
                "information": "Double click is a company that is owned by Google and provides online publishers with adverts. Double click can be used to show users adverts that are based on their activity",
                "linkToMoreInfo": "https://www.theguardian.com/technology/2012/apr/23/doubleclick-tracking-trackers-cookies-web-monitoring"
            }
        };
        let found = false;
        for (let key in domains) {
            if (key === node.id) {
                this.setState({lookUpDomainResult: {
                    "domain": node.id,
                    "domainPresent": true,
                    "parentcompany": domains[key]["parentcompany"],
                    "information": domains[key]["information"]
                }});
                found = true;
                break;
            }
        }

        if (!found) {
            this.setState({lookUpDomainResult: {"domainPresent": false, "domain": node.id}})
        }
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
                    <div className="button">
                        <Button variant="contained" size="small" color="secondary" onClick={() => {
                            this.reset();
                        }}>
                            Reset </Button>
                    </div>
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