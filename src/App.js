import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import wheels from './contracts/wheels';
import pinFile from './pinFile';

registerPlugin(FilePondPluginImagePreview);

class App extends Component {

  state = {
    ipfsHash:null,
    message: 'You haven\'t uploaded any file.',
    buffer:'',
    ethAddress:'',
    blockNumber:'',
    transactionHash:'',
    gasUsed:'',
    txReceipt: ''   
  };

  // const balance = wheels('0x76142ad47eE7e58e1856DFcF1A6996D2C27fb53A');
  // console.log(balance);

  constructor() {
    super();
    this.state = { data: [] };
  }

  // getContract() {
  //   const balance = wheels('0x76142ad47eE7e58e1856DFcF1A6996D2C27fb53A');
  //   this.setState({ data: balance });
  // }

  render() {return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {this.message}
        </p>
        <p>
          {/* {wheels('0x76142ad47eE7e58e1856DFcF1A6996D2C27fb53A')} */}
        </p>
      </header>
      <FilePond
        server={{
          process:(fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
            
            console.table(file);

            const request = new XMLHttpRequest();
            request.open('POST', './');
            // request.setRequestHeader('Content-Type', 'application/json');
            // request.setRequestHeader('pinata_api_key', '10e2908bf418b0edb269');
            // request.setRequestHeader('pinata_secret_api_key', '6d5317a95e54d944fe704ea713c12adf7b4099a5a63191a5b3754545ee9bf954');

            // Should call the progress method to update the progress to 100% before calling load
            // Setting computable to false switches the loading indicator to infinite mode
            request.upload.onprogress = (e) => {
                progress(e.lengthComputable, e.loaded, e.total);
            };

            // // Should call the load method when done and pass the returned server file id
            // // this server file id is then used later on when reverting or restoring a file
            // // so your server knows which file to return without exposing that info to the client
            // request.onload = function() {
            //     if (request.status >= 200 && request.status < 300) {
            //         // the load method accepts either a string (id) or an object
            //         load(request.responseText);
            //     }
            //     else {
            //         // Can call the error method if something is wrong, should exit after
            //         error('oh no');
            //     }
            // };
            // console.log(request);
            // request.send(file);
            this.ipfsHash = pinFile(file);
            request.send(file);
            
            // Should expose an abort method so the request can be cancelled
            return {
                abort: () => {
                  // This function is entered if the user has tapped the cancel button
                  request.abort();

                  // Let FilePond know the request has been cancelled
                  abort();
                }
            };
          }
        }}
      ></FilePond>
    </div>
  )}
};

export default App;