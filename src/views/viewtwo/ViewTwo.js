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
    };

    changeView = (viewNumber) => {
        this.setState({viewToDisplay: viewNumber})
    };

    handleChange = (event) => {
        this.setState({showOnlyParentCompanies: event.target.checked});
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
                    <D3ForceGraph message={this.props.message} handleChange={this.handleChange}/>
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
                    <TableView message={this.props.message}/>
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
                <WordCloud message={this.props.message}/>
            </>
        );
    }
}

export default ViewTwo;