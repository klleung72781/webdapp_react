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

  // const balance = wheels('0x76142ad47eE7e58e1856DFcF1A6996D2C27fb53A');
  // console.log(balance);

  // getContract() {
  //   const balance = wheels('0x76142ad47eE7e58e1856DFcF1A6996D2C27fb53A');
  //   this.setState({ data: balance });
  // }

  constructor(props) {
    super(props);
    this.state = {
      message: 'You haven\'t uploaded any file.',
      file: [{
        source: 'index.html',
        options: {
            type: 'local'
        }
      }],
      ipfsHash: null
    };
  }

  componentDidMount() {
    // this.timerID = setInterval(
    //   () => this.tick(),
    //   1000
    // );
  }

  componentWillUnmount() {
    // clearInterval(this.timerID);
  }

  // tick() {
  //   this.setState({
  //     date: new Date()
  //   });
  // }

  handleInit() {
  }

  setStateFile(file) {
    this.setState({
      file: file
    });
    console.log(this.state.file);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            {this.state.message}
          </p>
        </header>
        <FilePond
          server={{
            process:(fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
              
              this.setStateFile(file);

              const request = new XMLHttpRequest();
              request.open('POST', './');
              // Should call the progress method to update the progress to 100% before calling load
              // Setting computable to false switches the loading indicator to infinite mode
              request.upload.onprogress = (e) => {
                  progress(e.lengthComputable, e.loaded, e.total);
              };

              this.setState({
                ipfsHash: pinFile(file)
              });
              request.send(file);
              
              return {
                abort: () => {
                  // This function is entered if the user has tapped the cancel button
                  request.abort();

                  // request cancelled
                  abort();
                }
              };
            }
          }}
          oninit={ () => this.handleInit() }
        ></FilePond>
      </div>
    )
  }
};

export default App;