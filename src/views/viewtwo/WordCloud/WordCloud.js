import React, {Component} from 'react';
import Loading from "../../../loading/LoadingBar";
import ReactWordcloud from 'react-wordcloud';
import "./WordCloud.css";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

class WordCloud extends Component {

    state = {
        data: null,
        result: null,
        showOnlyParentCompanies: false,
    };

    componentDidMount() {
        this.getTrackedWebsite();
    }

    handleChange = (event) => {
        this.setState({showOnlyParentCompanies: event.target.checked}, this.getTrackedWebsite);
    };

    switchButton = () => {
        return (
            <div className="switch">
                <FormGroup row>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={this.state.showOnlyParentCompanies}
                                onChange={this.handleChange}
                                value="checkedB"
                                color="secondary"
                            />
                        }
                        label="Only show parent companies"
                    />
                </FormGroup>
            </div>
        )
    };

    getTrackedWebsite = () => {
        let jsonBody = JSON.stringify({
            showOnlyParentCompanies: this.state.showOnlyParentCompanies
        });

        fetch("http://localhost:8080/getWordCloud", {
            method: 'POST',
            dataType: 'json',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: jsonBody
        }).then(response => response.json())
            .then(data => this.setState({result: data})
            );
    };

    render() {

        if (this.state.result === null) {
            return Loading();
        } else {
            return (
                <>
                    <br/>
                    {this.switchButton()}
                    <div className="graph">
                        <ReactWordcloud
                            options={{
                                rotations: 0
                            }}
                            words={this.state.result["wordCloudWords"]}
                        />
                    </div>
                </>
            );
        }
    }
}

export default WordCloud;