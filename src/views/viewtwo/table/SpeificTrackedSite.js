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
        this.getAllSitesWithRequestTrackedWebsite();
        setInterval(this.getAllSitesWithRequestTrackedWebsite, 5000);
    }

    getAllSitesWithRequestTrackedWebsite = () => {
        let jsonBody = JSON.stringify({
            trackedSite: this.props.trackedSite
        });

        fetch("http://localhost:8080/getTablesRowsForTrackedSite", {
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

        const trackedSite = <p> Showing all results where the tracked site is <b> {this.props.trackedSite} </b> </p>;

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
                            title={trackedSite}
                            columns={[
                                {title: 'Tracked Site', field: 'trackedSite'},
                                {title: 'Tracker', field: 'tracker'},
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

export default SpeificTrackedSite;