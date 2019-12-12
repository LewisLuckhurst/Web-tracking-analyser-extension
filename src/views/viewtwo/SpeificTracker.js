import React, {Component} from 'react';
import "./TableView.css"
import MaterialTable from "material-table";
import Button from "@material-ui/core/Button";
import Loading from "../../loading/LoadingBar";

class SpeificTracker extends Component {

    constructor(props, context) {
        super(props, context);
    }

    state = {
        tableData: null
    };

    componentDidMount() {
        this.getSitesRequestedTrackerIsTracking();
        setInterval(this.getSitesRequestedTrackerIsTracking, 5000);
    }

    getSitesRequestedTrackerIsTracking = () => {
        let jsonBody = JSON.stringify({
            tracker: this.props.tracker
        });

        fetch("http://localhost:8080/getTablesRowsForTracker", {
            method: 'POST',
            dataType: 'json',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: jsonBody
        }).then(response => response.json())
            .then(data => this.setState({tableData: data}));
    };

    render() {

        if (this.state.tableData === null) {
            return (
                Loading()
            );
        }

        const trackerSite = "Showing all results where the tracker is " + this.props.tracker;
        let rows = [];
        for (let i = 0; i < this.state.tableData["tableRows"].length; i++) {
            rows.push({
                trackedSite: <Button size="small" onClick={() => {
                    this.props.getTrackedSite(this.state.tableData["tableRows"][i]["trackedSite"])
                }} color="secondary">
                    {this.state.tableData["tableRows"][i]["trackedSite"]}
                </Button>,
                tracker: <Button size="small" onClick={() => {
                    this.props.getTrackerSite(this.state.tableData["tableRows"][i]["tracker"])
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
                            title={trackerSite}
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