import React, {Component} from 'react';
import './App.css';
import ViewTwo from "./views/viewtwo/ViewTwo";
import NavigationBarTest from "./navigation/NavigationBar";
import ViewOne from "./views/viewone/ViewOne";

class App extends Component {
    state = {
        viewToDisplay: 0
    };

    changeView = (viewNumber) => {
        this.setState({viewToDisplay: viewNumber})
    };

    render() {
        if (this.state.viewToDisplay === 0) {
            return (
                <div className="App">
                    <NavigationBarTest changeView={this.changeView}/>
                    <ViewOne/>
                </div>
            );
        }

        return (
            <div className="App">
                <NavigationBarTest changeView={this.changeView}/>
                <ViewTwo/>
            </div>
        );
    }
}

export default App;
