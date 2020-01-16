import React, {Component} from 'react';
import ForceGraph2D from "react-force-graph-2d";
import "./D3ForceGraphCss.css"
import Loading from "../../../loading/LoadingBar";
import Button from "@material-ui/core/Button";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import SearchBar from "./Search";
import SearchBoxResult from "./SearchBoxResult";

class D3ForceGraph extends Component {

    state = {
        data: null,
        result: null,
        height: 0,
        width: 0,
        highLightedNodes: [],
        highLightedLinks: [],
        searchedNodes: [],
        showOnlyParentCompanies: false,
        searchBarText: "",
    };

    componentDidMount() {
        this.getTrackedWebsite();
        document.addEventListener("keydown", this._handleKeyDown);
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

    nodeHover = (node) => {
        if (node !== null) {
            const nodes = [];
            const links = [];
            this.state.result.links.forEach(link => {
                if (link.source.id === node.id) {
                    nodes.push(link.source);
                    nodes.push(link.target);
                    links.push(link);
                }

                if (link.target.id === node.id) {
                    nodes.push(link.source);
                    nodes.push(link.target);
                    links.push(link);
                }
            });
            this.setState({highLightedNodes: nodes});
            this.setState({highLightedLinks: links});
        } else {
            this.setState({highLightedNodes: []});
            this.setState({highLightedLinks: []});
        }
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

    refCallback = element => {
        if (element) {
            let test = element.getBoundingClientRect();
            this.setState({height: test.height});
            this.setState({width: test.width});
        }
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

    componentWillUnmount() {
        document.removeEventListener("keydown", this._handleKeyDown);
    }

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
                        <div ref={this.refCallback} className="graphContainer">
                            <ForceGraph2D
                                enableNodeDrag={true}
                                graphData={this.state.result}
                                width={this.state.width}
                                height={this.state.height}
                                linkWidth={link =>
                                    this.state.highLightedLinks.indexOf(link) !== -1 ? 5 : 1}

                                linkDirectionalParticles={4}
                                linkDirectionalParticleWidth={link => {
                                    if (this.state.highLightedLinks.indexOf(link) !== -1) {
                                        return 4
                                    } else {
                                        return 0
                                    }
                                }}
                                linkColor={() => 'gray'}
                                linkDirectionalArrowRelPos={1}
                                linkDirectionalArrowColor={() => 'red'}
                                linkDirectionalArrowLength={3}

                                onNodeHover={this.nodeHover}

                                nodeCanvasObject={(node, ctx, globalScale) => {
                                    const label = node.id;
                                    const fontSize = 25 / globalScale;
                                    ctx.font = `${fontSize}px Sans-Serif`;
                                    ctx.textAlign = 'center';
                                    ctx.fillStyle = 'black';
                                    if (this.state.highLightedNodes.indexOf(node) !== -1) {
                                        ctx.fillStyle = 'red';
                                    }

                                    if (this.state.searchedNodes.indexOf(node) !== -1) {
                                        ctx.fillStyle = 'blue';
                                    }
                                    ctx.fillText(label, node.x, node.y);
                                }}

                                nodeCanvasObjectMode={node =>
                                    this.state.highLightedNodes.indexOf(node) !== -1 ? "replace" : "replace"
                                }
                            />
                        </div>
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