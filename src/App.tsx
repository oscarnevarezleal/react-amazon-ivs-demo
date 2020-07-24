import * as React from "react";

import logo from './logo.svg';
import {v4 as uuid} from 'uuid';

import {Button, Card, Elevation, H5} from "@blueprintjs/core";

import GenericDialog from './GenericDialog'
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/index.html
// import individual service
// import S3 from 'aws-sdk/clients/s3';
// To use the TypeScript definition files within a Node.js project, simply import aws-sdk as you normally would.
import {chimeApi} from "./api/ChimeApi";
import PlayerDemo from "./PlayerDemo";
import './App.css';

function App() {

    const [loading, setLoading] = React.useState(false);
    const [showDialog, setShowDialog] = React.useState(false);
    const [apiResponse, setApiResponse] = React.useState<any>({})

    return (
        <div className="App m-4">
            <Card interactive={false} elevation={Elevation.ZERO}>
                <div className='App-logo inline' dangerouslySetInnerHTML={{__html: logo}}/>
                <H5>AWS IVS demo</H5>
            </Card>
            <Card interactive={false} elevation={Elevation.ZERO}>
                <PlayerDemo title={'Poll #1984'}/>
            </Card>
            <GenericDialog isOpen={showDialog}>
                <p style={{
                    marginBottom: '10px',
                    marginTop: 0,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all'
                }}>{JSON.stringify(apiResponse, null, 3)}</p>
            </GenericDialog>
        </div>
    );
}

export default App;
