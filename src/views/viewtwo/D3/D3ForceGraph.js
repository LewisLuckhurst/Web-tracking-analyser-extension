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

class D3ForceGraph extends Component {

    state = {
        data: null,
        result: null,
        height: 0,
        width: 0,
        searchedNodes: [],
        showOnlyParentCompanies: false,
        searchBarText: "",
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

    highLightNode = () => {
        this.state.result.nodes.forEach(node => {
            if (node.id === this.state.searchBarText) {
                if (!this.state.searchedNodes.includes(node)) {
                    this.state.searchedNodes.push(node)
                }
            }
        });
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
        let test = [];
        this.state.searchedNodes.forEach(node => {
            test.push(<SearchBoxResult companyName={node.id} removeSearch={this.removeNodeHighlight}/>)
        });
        this.setState({searchBoxes: test});
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
                    <div className="forceGraphGrid">
                        <Graph result={this.state.result}
                               searchedNodes={this.state.searchedNodes}
                        />
                        <div>
                            <SearchBar
                                updateText={this.updateSearchBarText}
                                highLightNode={this.highLightNode}
                            />
                            {this.state.searchBoxes}
                        </div>
                    </div>
                </>
            );
        }
    }
}

export default D3ForceGraph;