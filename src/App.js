import React from 'react';
import './App.css';

function App() {
    return (
        <div className="App">
            <h1>Information that could be tracked:</h1>
            <div className="wrapper">
                <div className="block">
                    <div className="table">
                        <div className="secondColumn">
                            <p>Ip Address:</p>
                            <p>Continent Name:</p>
                            <p>Country Name:</p>
                            <p>Region Name:</p>
                            <p>City:</p>
                            <p>Post code:</p>
                        </div>
                        {/*this.latitude = jsonObject.get("latitude").getAsString();*/}
                        {/*this.longitude = jsonObject.get("longitude").getAsString();*/}

                        <div className="thirdColumn">
                            <p>World</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default App;
