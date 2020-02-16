/*global browser*/
import React, {Component} from 'react';
import "./TableView.css"
import MaterialTable from "material-table";
import Button from "@material-ui/core/Button";
import Loading from "../../../loading/LoadingBar";

class SpeificTracker extends Component {

    constructor(props, context) {
        super(props, context);
    }

    state = {
        tableData: null
    };

    componentDidMount() {
        this.getValues();
        setInterval(this.getValues, 5000);
    }

    handleResponse = (message) => {
        this.setState({tableData: message["tableTrackers"]});
    };

    handleError = (error) => {
        console.log(`Error: ${error}`);
    };

    getValues = (e) => {
        const sending = browser.runtime.sendMessage({});
        sending.then(this.handleResponse, this.handleError);
    };

    render() {

        if (this.state.tableData === null) {
            return (
                Loading()
            );
        }

        const trackerSite = <p> Showing all results where the tracker is <b> {this.props.tracker} </b> </p>;

        let rows = [];
        let data = this.state.tableData;
        for (let i = 0; i < data.length; i++) {
            if(data[i]["tracker"] === this.props.tracker) {
                rows.push({
                    trackedSite: this.state.tableData[i]["trackedSite"],
                    tracker: this.state.tableData[i]["tracker"],
                    firstAccess: this.state.tableData[i]["firstAccess"],
                    lastAccess: this.state.tableData[i]["lastAccess"],
                    numberOfOccurrences: this.state.tableData[i]["numberOfOccurrences"],
                    secure: this.state.tableData[i]["secureConnection"]
                });
            }
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
                            title={trackerSite}
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
                        <Button variant="contained" color="secondary" onClick={this.props.reset}>
                            Show all sites
                        </Button>
                    </div>
                </div>
            </>
        );
    }
}

export default SpeificTracker;