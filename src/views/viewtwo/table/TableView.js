import React, {Component} from 'react';
import "./TableView.css"
import SpecificTracker from "./SpecificTracker";
import SpecificTrackedSite from "./SpeificTrackedSite";
import AllSites from "./AllSites";
import {Tooltip} from "@material-ui/core";
import Button from "@material-ui/core/Button";

class TableView extends Component {

    state = {
        tableData: null,
        tableToDisplay: 0,
        siteToSearchFor: null,
        viewToDisplay: 0,
        numberOfRowsToDisplay: 10
    };

    changeTable = (viewNumber) => {
        this.setState({tableToDisplay: viewNumber})
    };

    changeNumberOfRowsToDisplay = (pageSize) => {
        this.setState({numberOfRowsToDisplay: pageSize})
    };

    reset = () => {
        this.changeTable(0);
    };

    getTrackedSite = (siteToLookFor) => {
        this.setState({siteToSearchFor: siteToLookFor},
            () => this.changeTable(1));
    };

    getTrackerSite = (siteToLookFor) => {
        this.setState({siteToSearchFor: siteToLookFor},
            () => this.changeTable(2));
    };

    columnButton = (text, tooltip) => {
        return <Tooltip title={tooltip} placement="top">
            <Button variant="outlined"
                    size="small"
                    color="primary">
                {text}
            </Button>
        </Tooltip>
    };

    render() {
        if (this.state.tableToDisplay === 0) {
            return (
                <>
                    <AllSites id={this.props.id}
                              getTrackerSite={this.getTrackerSite}
                              getTrackedSite={this.getTrackedSite}
                              changeNumberOfRowsToDisplay={this.changeNumberOfRowsToDisplay}
                              numberOfRowsToDisplay={this.state.numberOfRowsToDisplay}
                              reset={this.reset}
                              title={this.columnButton}
                    />
                </>
            );
        }

        if (this.state.tableToDisplay === 1) {
            return (
                <SpecificTrackedSite id={this.props.id}
                                     trackedSite={this.state.siteToSearchFor}
                                     getTrackerSite={this.getTrackerSite}
                                     getTrackedSite={this.getTrackedSite}
                                     changeNumberOfRowsToDisplay={this.changeNumberOfRowsToDisplay}
                                     numberOfRowsToDisplay={this.state.numberOfRowsToDisplay}
                                     reset={this.reset}
                                     title={this.columnButton}
                />
            );
        }

        if (this.state.tableToDisplay === 2) {
            return (
                <SpecificTracker id={this.props.id}
                                 tracker={this.state.siteToSearchFor}
                                 getTrackerSite={this.getTrackerSite}
                                 getTrackedSite={this.getTrackedSite}
                                 changeNumberOfRowsToDisplay={this.changeNumberOfRowsToDisplay}
                                 numberOfRowsToDisplay={this.state.numberOfRowsToDisplay}
                                 reset={this.reset}
                                 title={this.columnButton}
                />
            );
        }
    }
}

export default TableView;