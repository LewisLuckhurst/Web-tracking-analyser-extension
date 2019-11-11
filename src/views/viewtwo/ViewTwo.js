import React, {Component} from 'react';
import ForceGraph2D from 'react-force-graph-2d';

class ViewTwo extends Component {

    state = {
        data: null,
        result: null
    };

    render() {
        let test = {
            "nodes": [
                {
                    "id": "facebook.com",
                    "color": "#B3092A"
                },
                {
                    "id": "doubleclick.com"
                },
                {
                    "id": "google.com"
                },
                {
                    "id": "youtube.com"
                }
            ],
            "links": [
                {
                    "source": "facebook.com",
                    "target": "youtube.com"
                },
                {
                    "source": "doubleclick.com",
                    "target": "facebook.com"
                },
                {
                    "source": "doubleclick.com",
                    "target": "google.com"
                }
            ]
        };

        return (
            <>
                <h1> Website trackers visualisation: </h1>
                <ForceGraph2D
                    graphData={test}
                    linkColor={() => '#b3b3b3'}
                    linkWidth={1}
                    nodeCanvasObject={(node, ctx, globalScale) => {
                        const label = node.id;
                        const fontSize = 20 / globalScale;
                        ctx.font = `${fontSize}px Sans-Serif`;
                        ctx.textAlign = 'center';
                        ctx.fillStyle = node.color;
                        ctx.fillText(label, node.x, node.y);
                    }}
                />
            </>
        );
    }
}

export default ViewTwo;