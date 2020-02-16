/*global browser*/
import React, {Component} from 'react';
import './App.css';
import ViewTwo from "./views/viewtwo/ViewTwo";
import NavigationBarTest from "./navigation/NavigationBar";
import ViewOne from "./views/viewone/ViewOne";


class App extends Component {
    state = {
        viewToDisplay: 0,
    };

    componentDidMount() {
        this.getValues();
    }

    handleResponse = (message) => {
        this.setState({message: message});
    };

    handleError = (error) => {
        console.log(`Error: ${error}`);
    };

    getValues = (e) => {
        const sending = browser.runtime.sendMessage({});
        sending.then(this.handleResponse, this.handleError);
    };

    changeView = (viewNumber) => {
        this.setState({viewToDisplay: viewNumber})
    };

    render() {
        if (this.state.viewToDisplay === 0) {
            return (
                <div className="App">
                    <NavigationBarTest changeView={this.changeView}/>
                    <ViewOne id={this.state.id}/>
                </div>
            );
        }

        return (
            <div className="App">
                <NavigationBarTest changeView={this.changeView}/>
                <ViewTwo message={this.state.message}/>
            </div>
        );
    }
}

export default App;
