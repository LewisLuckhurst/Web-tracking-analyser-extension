/*global browser*/
import React, {Component} from 'react';
import "./TableView.css"
import MaterialTable from "material-table";
import Button from "@material-ui/core/Button";
import Loading from "../../../loading/LoadingBar";
import TableViewSelector from "./TableViewSelector";
import {Tooltip} from "@material-ui/core";

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

    Title = (text, tooltip) => {
        return <Tooltip title={tooltip} placement="top">
            <Button variant="outlined"
                    size="small"
                    color="primary">
                {text}
            </Button>
        </Tooltip>
    };

    AllDataView = () => {
        let rows = [];
        let uniqueTrackers = new Set();
        for (let i = 0; i < this.state.tableData.length; i++) {
            uniqueTrackers.add(this.state.tableData[i]["tracker"]);
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
                            <h2>{uniqueTrackers.size}</h2>
                        </div>
                        <br/>
                        <TableViewSelector changeView={this.changeView} view={this.state.tableView}/>
                        <MaterialTable
                            title="Showing all sites"
                            columns={[
                                {
                                    title: this.Title("Tracked site", "The site being tracked"), field: 'trackedSite', render: rowData =>
                                        <Button size="small" onClick={() => {
                                            this.props.getTrackedSite(rowData.trackedSite)
                                        }} color="secondary">
                                            {rowData.trackedSite}</Button>
                                },
                                {
                                    title: this.Title("Tracker", "The tracker's domain"), field: "tracker", render: rowData => <Button size="small" onClick={() => {
                                        this.props.getTrackerSite(rowData.tracker)
                                    }} color="secondary">
                                        {rowData.tracker}
                                    </Button>
                                },
                                {
                                    title: this.Title("First access", "The time this request was first made"), field: 'firstAccess'
                                },
                                {
                                    title: this.Title("Last access", "The most recent time this request was made"), field: 'lastAccess'
                                },
                                {
                                    title: this.Title("Connections", "The total number of times a connection has been made between the two sites"), field: 'numberOfOccurrences'
                                },
                                {
                                    title: this.Title("Secure", "Secure – Is this third-party connection secured (e.g., using HTTPS)?"), field: 'secure'
                                },
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
                                {
                                    title: this.Title("Tracked site", "The site being tracked"),
                                    field: 'trackedSite',
                                    render: rowData => <Button size="small" onClick={() => {
                                        this.props.getTrackedSite(rowData.trackedSite)
                                    }} color="secondary">
                                        {rowData.trackedSite}
                                    </Button>
                                },
                                {title: this.Title("Tracker count", "The total number of trackers tracking this site"), field: 'numberOfTrackers'},
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
                                {
                                    title: this.Title("Tracker", "The tracker's domain"),
                                    field: 'tracker',
                                    render: rowData => <Button size="small" onClick={() => {
                                        this.props.getTrackerSite(rowData.tracker)
                                    }} color="secondary">
                                        {rowData.tracker}
                                    </Button>
                                },
                                {title: 'Tracked count', field: 'The total number of sites this tracker is tracking'}
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

        if (this.state.tableView === 0) {
            return this.AllDataView();
        }

        if (this.state.tableView === 1) {
            return this.onlyTrackedSiteView();
        }

        return this.onlyTrackersView();
    }
}

export default AllSites;