import React, {Component} from 'react';
import TableView from "./table/TableView";
import SelectorBar from "./SelectorBar";
import "./ViewTwo.css"
import D3ForceGraph from "./D3/D3ForceGraph";
import WordCloud from "./WordCloud/WordCloud";

class ViewTwo extends Component {

    state = {
        viewToDisplay: 0,
        showOnlyParentCompanies: false,
        result: null
    };

    changeView = (viewNumber) => {
        this.setState({viewToDisplay: viewNumber})
    };

    handleChange = (event) => {
        this.setState({showOnlyParentCompanies: event.target.checked});
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
        if (this.state.viewToDisplay === 0) {
            return (
                <>
                    <div className="grid">
                        <div className="selectorBar">
                            <SelectorBar changeView={this.changeView}/>
                        </div>
                    </div>
                    <D3ForceGraph handleChange={this.handleChange}/>
                </>
            );
        }

        if (this.state.viewToDisplay === 1) {
            return (
                <>
                    <div className="grid">
                        <div className="selectorBar">
                            <SelectorBar changeView={this.changeView}/>
                        </div>
                    </div>
                    <TableView/>
                </>
            );
        }

        return (
            <>
                <div className="grid">
                    <div className="selectorBar">
                        <SelectorBar changeView={this.changeView}/>
                    </div>
                </div>
                <WordCloud/>
            </>
        );
    }
}

export default ViewTwo;