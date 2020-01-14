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
        this.getTrackedWebsiteTable();
        this.getOnlyTrackedSites();
        this.getOnlyTrackerSites();
        setInterval(this.getTrackedWebsiteTable, 5000);
        setInterval(this.getOnlyTrackedSites, 5000);
        setInterval(this.getOnlyTrackerSites, 5000);
    }

    changeView = (viewNumber) => {
        this.setState({tableView: viewNumber})
    };

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

    getOnlyTrackerSites = () => {
        fetch("http://localhost:8080/onlyTrackers", {
            method: 'POST',
            dataType: 'json',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(response => response.json())
            .then(data => this.setState({onlyTrackerSites: data}));
    };

    getOnlyTrackedSites = () => {
        fetch("http://localhost:8080/onlyTrackedSites", {
            method: 'POST',
            dataType: 'json',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(response => response.json())
            .then(data => this.setState({onlyTrackedSites: data}));
    };

    AllDataView = () => {
        let rows = [];
        for (let i = 0; i < this.state.tableData["tableRows"].length; i++) {
            rows.push({
                trackedSite:
                    this.state.tableData["tableRows"][i]["trackedSite"],
                tracker: this.state.tableData["tableRows"][i]["tracker"],
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
                            options={{
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
        for (let i = 0; i < this.state.onlyTrackedSites.length; i++) {
            rows.push({
                trackedSite: this.state.onlyTrackedSites[i],
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
    };

    onlyTrackersView = () => {
        let rows = [];
        for (let i = 0; i < this.state.onlyTrackerSites.length; i++) {
            rows.push({
                tracker: this.state.onlyTrackerSites[i],
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
    };

    render() {
        if (this.state.tableData === null || this.state.onlyTrackedSites === null || this.state.onlyTrackerSites === null) {
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