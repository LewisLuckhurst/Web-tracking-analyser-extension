/*global browser*/
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
        message: null,
        callBacks: null
    };

    componentDidMount() {
        this.getValues();
        this.setState({callBacks:
                {getWordTooltip: word => `"${word.text}" is tracking ${word.value} number of sites.`}
        })
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

    handleResponse = (message) => {
        this.setState({message: message});
        this.getTrackedWebsite();
    };

    handleError = (error) => {
        console.log(`Error: ${error}`);
    };

    getValues = (e) => {
        const sending = browser.runtime.sendMessage({});
        sending.then(this.handleResponse, this.handleError);
    };

    getTrackedWebsite = () => {
        let data = [];
        if(!this.state.showOnlyParentCompanies){
            for (let [key, value] of this.state.message["allTrackers"]) {
                data.push({
                    text: String(key),
                    value: value.size,
                });
            }
        } else {
            for (let [key, value] of this.state.message["onlyParentCompanyTrackers"]) {
                data.push({
                    text: String(key),
                    value: value.size,
                });
            }
        }
        this.setState({result: data});
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
                                rotations: 0,
                                scale: 10,
                                fontSizes: [25, 120]
                            }}
                            words={this.state.result}
                            callbacks={this.state.callBacks}
                        />
                    </div>
                </>
            );
        }
    }
}

export default WordCloud;