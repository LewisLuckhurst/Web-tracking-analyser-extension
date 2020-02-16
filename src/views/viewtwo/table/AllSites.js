/*global browser*/
import React, {Component} from 'react';
import "./TableView.css"
import MaterialTable from "material-table";
import Button from "@material-ui/core/Button";
import Loading from "../../../loading/LoadingBar";
import TableViewSelector from "./TableViewSelector";

class AllSites extends Component {

    constructor(props, context) {
        super(props, context);
    }

    state = {
        tableData: null,
        tableView: 0,
        onlyTrackerSites: null,
        onlyTrackedSites: null,
    };

    componentDidMount() {
        this.getValues();
        setInterval(this.getValues, 5000);
    }

    handleResponse = (message) => {
        this.getTrackedWebsiteTable(message);
        this.getOnlyTrackerSites(message);
        this.getOnlyTrackedSites(message);
    };

    handleError = (error) => {
        console.log(`Error: ${error}`);
    };

    getValues = (e) => {
        const sending = browser.runtime.sendMessage({});
        sending.then(this.handleResponse, this.handleError);
    };

    changeView = (viewNumber) => {
        this.setState({tableView: viewNumber})
    };

    getTrackedWebsiteTable = (message) => {
        this.setState({tableData: message["tableTrackers"]});
    };

    getOnlyTrackerSites = (message) => {
        let trackerSiteMap = new Map();
        for (let i = 0; i < message["tableTrackers"].length; i++) {
            let row = message["tableTrackers"][i];

            if (trackerSiteMap.has(row["tracker"])) {
                let numberOfOccurrences = trackerSiteMap.get(row["tracker"]) + 1;
                trackerSiteMap.set(row["tracker"], numberOfOccurrences);
            } else {
                trackerSiteMap.set(row["tracker"], 1);
            }
        }
        this.setState({onlyTrackerSites: trackerSiteMap});
    };

    getOnlyTrackedSites = (message) => {
        let trackedSiteMap = new Map();
        for (let i = 0; i < message["tableTrackers"].length; i++) {
            let row = message["tableTrackers"][i];

            if (trackedSiteMap.has(row["trackedSite"])) {
                let numberOfOccurrences = trackedSiteMap.get(row["trackedSite"]) + 1;
                trackedSiteMap.set(row["trackedSite"], numberOfOccurrences);
            } else {
                trackedSiteMap.set(row["trackedSite"], 1);
            }
        }

        this.setState({onlyTrackedSites: trackedSiteMap});
    };

    AllDataView = () => {
        let rows = [];
        for (let i = 0; i < this.state.tableData.length; i++) {
            rows.push({
                trackedSite: this.state.tableData[i]["trackedSite"],
                tracker: this.state.tableData[i]["tracker"],
                firstAccess: this.state.tableData[i]["firstAccess"],
                lastAccess: this.state.tableData[i]["lastAccess"],
                numberOfOccurrences: this.state.tableData[i]["numberOfOccurrences"],
                secure: this.state.tableData[i]["secureConnection"]
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
                        <TableViewSelector changeView={this.changeView} view={this.state.tableView}/>
                        <MaterialTable
                            title="Showing all sites"
                            columns={[
                                {title: 'Tracked Site', field: 'trackedSite', render: rowData => <Button size="small" onClick={() => {
                                        this.props.getTrackedSite(rowData.trackedSite)
                                    }} color="secondary">
                                        {rowData.trackedSite}
                                    </Button>},
                                {title: 'Tracker', field: 'tracker', render: rowData => <Button size="small" onClick={() => {
                                        this.props.getTrackerSite(rowData.tracker)
                                    }} color="secondary">
                                        {rowData.tracker}
                                    </Button>},
                                {title: 'First Access', field: 'firstAccess'},
                                {title: 'Last Access', field: 'lastAccess'},
                                {title: 'Number', field: 'numberOfOccurrences'},
                                {title: 'HTTPS', field: 'secure'},
                            ]}
                            data={rows}
                            onChangeRowsPerPage={this.props.changeNumberOfRowsToDisplay}
                            options={{
                                pageSize: this.props.numberOfRowsToDisplay,
                                pageSizeOptions: [5, 10, 20, 50, 100],
                                search: true
                            }}
                        />
                        <br/>
                    </div>
                </div>
            </>
        );
    };

    onlyTrackedSiteView = () => {
        let rows = [];
        for (let [key, value] of this.state.onlyTrackedSites) {
            rows.push({
                trackedSite: key,
                numberOfTrackers: value,
            });
        }

        return (
            <>
                <div className="wrapper">
                    <div className="trackingTable">
                        <TableViewSelector changeView={this.changeView} view={this.state.tableView}/>
                        <MaterialTable
                            title="Showing Only Tracked Sites"
                            columns={[
                                {title: 'Tracked Site', field: 'trackedSite', render: rowData => <Button size="small" onClick={() => {
                                        this.props.getTrackedSite(rowData.trackedSite)
                                    }} color="secondary">
                                        {rowData.trackedSite}
                                    </Button>},
                                {title: 'Number of Trackers tracking this site', field: 'numberOfTrackers'},
                            ]}
                            data={rows}
                            onChangeRowsPerPage={this.props.changeNumberOfRowsToDisplay}
                            options={{
                                pageSize: this.props.numberOfRowsToDisplay,
                                pageSizeOptions: [5, 10, 20, 50, 100],
                                search: true
                            }}
                        />
                        <br/>
                    </div>
                </div>
            </>
        );
    };

    onlyTrackersView = () => {
        let rows = [];
        for (let [key, value] of this.state.onlyTrackerSites) {
            rows.push({
                tracker: key,
                numberOfTrackedSites: value,
            });
        }

        return (
            <>
                <div className="wrapper">
                    <div className="trackingTable">
                        <TableViewSelector changeView={this.changeView} view={this.state.tableView}/>
                        <MaterialTable
                            title="Showing Only Trackers"
                            columns={[
                                {title: 'Tracker', field: 'tracker', render: rowData => <Button size="small" onClick={() => {
                                        this.props.getTrackerSite(rowData.tracker)
                                    }} color="secondary">
                                        {rowData.tracker}
                                    </Button>},
                                {title: 'Number of Sites this tracker is tracking', field: 'numberOfTrackedSites'}
                            ]}
                            data={rows}
                            onChangeRowsPerPage={this.props.changeNumberOfRowsToDisplay}
                            options={{
                                pageSize: this.props.numberOfRowsToDisplay,
                                pageSizeOptions: [5, 10, 20, 50, 100],
                                search: true,
                            }}
                        />
                        <br/>
                    </div>
                </div>
            </>
        );
    };

    render() {
        if (this.state.tableData == null) {
            return (
                Loading()
            );
        }

        if(this.state.tableView === 0){
            return this.AllDataView();
        }

        if(this.state.tableView === 1){
            return this.onlyTrackedSiteView();
        }

        return this.onlyTrackersView();
    }
}

export default AllSites;