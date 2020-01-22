import React, {Component} from 'react';
import "./TableView.css"
import SpecificTracker from "./SpeificTracker";
import SpecificTrackedSite from "./SpeificTrackedSite";
import AllSites from "./AllSites";

class TableView extends Component {

    state = {
        tableData: null,
        tableToDisplay: 0,
        siteToSearchFor: null,
        viewToDisplay: 0,
        numberOfRowsToDisplay: 20
    };

    changeTable = (viewNumber) => {
        this.setState({tableToDisplay: viewNumber})
    };

    changeNumberOfRowsToDisplay = (pageSize) => {
        this.setState({numberOfRowsToDisplay: pageSize})
    };

    changeView = (viewNumber) => {
        this.setState({viewToDisplay: viewNumber})
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

    render() {
        if (this.state.tableToDisplay === 0) {
            return (
                <>
                    <AllSites getTrackerSite={this.getTrackerSite}
                              getTrackedSite={this.getTrackedSite}
                              changeNumberOfRowsToDisplay={this.changeNumberOfRowsToDisplay}
                              numberOfRowsToDisplay={this.state.numberOfRowsToDisplay}
                              reset={this.reset}/>
                </>
            );
        }

        if (this.state.tableToDisplay === 1) {
            return (
                <SpecificTrackedSite trackedSite={this.state.siteToSearchFor}
                                     getTrackerSite={this.getTrackerSite}
                                     getTrackedSite={this.getTrackedSite}
                                     changeNumberOfRowsToDisplay={this.changeNumberOfRowsToDisplay}
                                     numberOfRowsToDisplay={this.state.numberOfRowsToDisplay}
                                     reset={this.reset}/>
            );
        }

        if (this.state.tableToDisplay === 2) {
            return (
                <SpecificTracker tracker={this.state.siteToSearchFor}
                                 getTrackerSite={this.getTrackerSite}
                                 getTrackedSite={this.getTrackedSite}
                                 changeNumberOfRowsToDisplay={this.changeNumberOfRowsToDisplay}
                                 numberOfRowsToDisplay={this.state.numberOfRowsToDisplay}
                                 reset={this.reset}/>
            );
        }
    }
}

export default TableView;