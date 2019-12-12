import React, {Component} from 'react';
import "./TableView.css"
import MaterialTable from "material-table";
import Button from "@material-ui/core/Button";
import Loading from "../../loading/LoadingBar";
import SpeificTracker from "./SpeificTracker";
import SpeificTrackedSite from "./SpeificTrackedSite";

class TableView extends Component {

    state = {
        tableData: null,
        tableToDisplay: 0,
        siteToSearchFor: null
    };

    changeTable = (viewNumber) => {
        this.setState({tableToDisplay: viewNumber})
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

    componentDidMount() {
        this.getTrackedWebsiteTable();
        setInterval(this.getTrackedWebsiteTable, 5000);
    }

    getTrackedWebsiteTable = () => {
        fetch("http://localhost:8080/getTablesRows", {
            method: 'POST',
            dataType: 'json',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(response => response.json())
            .then(data => this.setState({tableData: data}));
    };

    render() {
        if (this.state.tableData === null) {
            return (
                Loading()
            );
        }

        if (this.state.tableToDisplay === 0) {
            let rows = [];
            for (let i = 0; i < this.state.tableData["tableRows"].length; i++) {
                rows.push({
                    trackedSite: <Button size="small" onClick={() => {
                        this.getTrackedSite(this.state.tableData["tableRows"][i]["trackedSite"])
                    }} color="secondary">
                        {this.state.tableData["tableRows"][i]["trackedSite"]}
                    </Button>,
                    tracker: <Button size="small" onClick={() => {
                        this.getTrackerSite(this.state.tableData["tableRows"][i]["tracker"])
                    }} color="secondary">
                        {this.state.tableData["tableRows"][i]["tracker"]}
                    </Button>,
                    firstAccess: this.state.tableData["tableRows"][i]["firstAccess"],
                    lastAccess: this.state.tableData["tableRows"][i]["lastAccess"],
                    numberOfOccurrences: this.state.tableData["tableRows"][i]["numberOfOccurrences"],
                    secure: this.state.tableData["tableRows"][i]["secureConnection"]
                });
            }

            return (
                <>
                    <div className="wrapper">
                        <div className="trackingTable">
                            <h2>Tracker Count:</h2>
                            <div className="trackerCount">
                                <h2>{this.state.tableData["totalTrackedSites"]}</h2>
                            </div>
                            <br/>
                            <MaterialTable
                                title="Showing all sites"
                                columns={[
                                    {title: 'Tracked Site', field: 'trackedSite'},
                                    {title: 'Tracker', field: 'tracker'},
                                    {title: 'First Access', field: 'firstAccess'},
                                    {title: 'Last Access', field: 'lastAccess'},
                                    {title: 'Number', field: 'numberOfOccurrences'},
                                    {title: 'HTTPS', field: 'secure'},
                                ]}
                                data={rows}
                                options={{
                                    search: true
                                }}
                            />
                            <br/>
                        </div>
                    </div>
                </>
            );
        }

        if (this.state.tableToDisplay === 1) {
            return (
                <SpeificTrackedSite trackedSite={this.state.siteToSearchFor}
                                    getTrackerSite={this.getTrackerSite}
                                    getTrackedSite={this.getTrackedSite}
                                    reset={this.reset}/>
            );
        }

        if (this.state.tableToDisplay === 2) {
            return (
                <SpeificTracker tracker={this.state.siteToSearchFor}
                                getTrackerSite={this.getTrackerSite}
                                getTrackedSite={this.getTrackedSite}
                                reset={this.reset}/>
            );
        }
    }
}

export default TableView;