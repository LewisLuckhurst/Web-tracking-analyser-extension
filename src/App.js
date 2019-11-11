import React, {Component} from 'react';
import './App.css';
import ViewTwo from "./views/viewtwo/ViewTwo";

class App extends Component {
    render() {
        return (
            <div className="App">
                {/*<ViewOne/>*/}
                <ViewTwo/>
            </div>
        );
    }
}

export default App;
