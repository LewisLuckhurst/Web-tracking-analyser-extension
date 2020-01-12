import React, {Component} from 'react';
import ForceGraph2D from "react-force-graph-2d";
import "./D3ForceGraphCss.css"
import Loading from "../../../loading/LoadingBar";
import Button from "@material-ui/core/Button";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

class D3ForceGraph extends Component {

    state = {
        data: null,
        result: null,
        height: 0,
        width: 0,
        highLightedNodes: [],
        highLightedLinks: [],
        showOnlyParentCompanies: false,
    };

    componentDidMount() {
        this.getTrackedWebsite();
    }

    handleChange = (event) => {
        this.setState({showOnlyParentCompanies: event.target.checked}, this.getTrackedWebsite);
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

    handleNodeHover = (node) => {
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
                    <div ref={this.refCallback} className="graph">
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

                            onNodeHover={this.handleNodeHover}

                            nodeCanvasObject={(node, ctx, globalScale) => {
                                const label = node.id;
                                const fontSize = 25 / globalScale;
                                ctx.font = `${fontSize}px Sans-Serif`;
                                ctx.textAlign = 'center';
                                ctx.fillStyle = 'black';
                                if (this.state.highLightedNodes.indexOf(node) !== -1) {
                                    ctx.fillStyle = 'red';
                                }
                                ctx.fillText(label, node.x, node.y);
                            }}

                            nodeCanvasObjectMode={node =>
                                this.state.highLightedNodes.indexOf(node) !== -1 ? "replace" : "replace"
                            }

                        />
                    </div>
                </>
            );
        }
    }
}

export default D3ForceGraph;