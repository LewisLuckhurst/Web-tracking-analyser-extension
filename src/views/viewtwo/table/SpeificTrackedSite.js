/*global browser*/
import React, {Component} from 'react';
import "./TableView.css"
import MaterialTable from "material-table";
import Button from "@material-ui/core/Button";
import Loading from "../../../loading/LoadingBar";

class SpeificTrackedSite extends Component {

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

        const trackedSite = <p> Showing all results where the tracked site is <b> {this.props.trackedSite} </b> </p>;

        let rows = [];
        let data = this.state.tableData;
        for (let i = 0; i < data.length; i++) {
            if(data[i]["trackedSite"] === this.props.trackedSite) {
                rows.push({
                    trackedSite: data[i]["trackedSite"],
                    tracker: data[i]["tracker"],
                    firstAccess: data[i]["firstAccess"],
                    lastAccess: data[i]["lastAccess"],
                    numberOfOccurrences: data[i]["numberOfOccurrences"],
                    secure: data[i]["secureConnection"]
                });
            }
        }

        return (
            <>
                <div className="wrapper">
                    <div className="trackingTable">
                        <h2>Tracker Count:</h2>
                        <div className="trackerCount">
                            <h2>{rows.length}</h2>
                        </div>
                        <br/>
                        <Button variant="contained" color="secondary" onClick={this.props.reset}>
                            Show all sites
                        </Button>
                        <br/>
                        <MaterialTable
                            title={trackedSite}
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
    }
}

export default SpeificTrackedSite;