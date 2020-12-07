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
      completed: false,
      files: [],
      sentFiles: [],
      ipfsHash: [],
      totalSupply: 0
    };
  }

  handleInit() {
  }

  async componentDidMount() {
    const totalSupply = await wheels();
    this.setState({totalSupply: totalSupply});
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            {this.state.message} {this.state.totalSupply}
          </p>
          {this.state.completed &&
            <ul>
              {this.state.ipfsHash.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          }
        </header>
        <FilePond
          ref = { ref => this.pond = ref }
          files = { this.state.files }
          allowMultiple = { true }
          oninit = { () => this.handleInit() }
          onupdatefiles = {(fileItems) => {
            this.setState({
              files: fileItems.map(f => f.file),
              message: `Uploading ${fileItems.length} file${fileItems.length > 1 ? 's': ''}`
            })
          }}
          onprocessfileprogress = {(file, progress) => {
            this.setState({
              message: progress !== 1 ? `Progress: ${parseInt(progress * 100)}%` : 'Load completed'
            })
          }}
          server = {{
            process:(fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
              
              this.setState({
                file: file
              });
              console.log(this.state.file)

              const request = new XMLHttpRequest();
              request.open('POST', './');
              // Should call the progress method to update the progress to 100% before calling load
              // Setting computable to false switches the loading indicator to infinite mode
              request.upload.onprogress = (e) => {
                  progress(e.lengthComputable, e.loaded, e.total);
              };

              let ipfsHash = this.state.ipfsHash.concat(pinFile(file));
              this.setState({
                ipfsHash: ipfsHash
              });
              console.table(this.state.ipfsHash);
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
        ></FilePond>
      </div>
    )
  }
};

export default App;