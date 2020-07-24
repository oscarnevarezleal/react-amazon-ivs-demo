import * as React from "react";
import {Card, Elevation, H5} from "@blueprintjs/core";
import GenericDialog from './GenericDialog'
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/index.html
// import individual service
// import S3 from 'aws-sdk/clients/s3';
// To use the TypeScript definition files within a Node.js project, simply import aws-sdk as you normally would.
import PlayerDemo from "./PlayerDemo";
import logo from './logo.svg';
import './App.css';

function App() {

    return (
        <div className="App m-4">
            <Card interactive={false} elevation={Elevation.ZERO}>
                <div className='App-logo inline' dangerouslySetInnerHTML={{__html: logo}}/>
                <H5>AWS IVS demo</H5>
            </Card>
            <Card interactive={false} elevation={Elevation.ZERO}>
                <PlayerDemo title={''}/>
            </Card>
        </div>
    );
}

export default App;
