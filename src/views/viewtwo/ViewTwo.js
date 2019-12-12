import React, {Component} from 'react';
import TableView from "./TableView";

class ViewTwo extends Component {

    state = {
        data: null,
        result: null
    };

    // componentDidMount() {
    //     this.getTrackedWebsite();
    //     setInterval(this.getTrackedWebsite, 30000);
    // }
    //
    // async getTrackedWebsite() {
    //     let jsonBody = JSON.stringify({
    //         showOnlyParentCompanies: false
    //     });
    //
    //     fetch("http://localhost:8080/getDomains", {
    //         method: 'POST',
    //         dataType: 'json',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json',
    //         },
    //         body: jsonBody
    //     }).then(response => response.json())
    //         .then(data => this.setState({result: data})
    //         );
    // };

    render() {
        // if (this.state.result === null) {
        //     return null;
        // } else {
            return (
                <>
                    <TableView/>
                    {/*<h1> Website trackers visualisation: </h1>*/}
                    {/*<div className="graph">*/}
                    {/*    <ForceGraph2D*/}
                    {/*        graphData={this.state.result}*/}
                    {/*        linkColor={() => '#b3b3b3'}*/}
                    {/*        linkWidth={1}*/}
                    {/*        nodeCanvasObject={(node, ctx, globalScale) => {*/}
                    {/*            const label = node.id;*/}
                    {/*            const fontSize = 20 / globalScale;*/}
                    {/*            ctx.font = `${fontSize}px Sans-Serif`;*/}
                    {/*            ctx.textAlign = 'center';*/}
                    {/*            ctx.fillStyle = node.color;*/}
                    {/*            ctx.fillText(label, node.x, node.y);*/}
                    {/*        }}*/}
                    {/*    />*/}
                    {/*</div>*/}
                </>
            );
        // }
    }
}

export default ViewTwo;