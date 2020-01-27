import React, {Component} from 'react';
import "./Graph.css";
import ForceGraph2D from "react-force-graph-2d";

class Graph extends Component {
    state = {
        height: 0,
        width: 0,
        highLightedNodes: [],
        highLightedLinks: [],
    };

    constructor(props) {
        super(props);
    }

    refCallback = element => {
        if (element) {
            let object = element.getBoundingClientRect();
            this.setState({height: object.height});
            this.setState({width: object.width});
        }
    };

    nodeHover = (node) => {
        if (node !== null) {
            const nodes = [];
            const links = [];
            this.props.result.links.forEach(link => {
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


    render() {
        return (
            <div ref={this.refCallback} className="graphContainer">
                <ForceGraph2D
                    enableNodeDrag={true}
                    graphData={this.props.result}
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
                    onNodeClick={this.props.lookUpDomain}

                    nodeCanvasObject={(node, ctx, globalScale) => {
                        const label = node.id;
                        let fontSize;
                        if(this.props.displayNodeSizeByNumberOfOccurrences === true){
                            fontSize = node.size / globalScale;
                        } else {
                            fontSize = 25 / globalScale;
                        }

                        ctx.font = `${fontSize}px Sans-Serif`;
                        const textWidth = ctx.measureText(label).width;
                        const bckgDimensions = [textWidth, 25].map(n => n + fontSize * 2); // some padding
                        ctx.fillStyle = 'transparent';
                        ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);


                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillStyle = 'black';
                        if(this.state.highLightedNodes.length > 0) {
                            if (this.state.highLightedNodes.indexOf(node) !== -1) {
                                ctx.fillStyle = 'red';
                            } else {
                                ctx.fillStyle = 'rgba(120, 114, 114, 0.3)';
                            }
                        }

                        if (this.props.searchedNodes.indexOf(node) !== -1) {
                            ctx.fillStyle = 'blue';
                        }
                        ctx.fillText(label, node.x, node.y);
                    }}
                />
            </div>
        );
    }
}

export default Graph;