import React, { Component } from 'react';
import axios from 'axios';
import * as RecordRTC from 'recordrtc';
import './App.css';

class App extends Component {
  constructor(props) {
      super(props);

      this.stream = null;
      this.mediaRecorder = null;
  }


    componentWillMount() {
      this.ws = new WebSocket('ws://127.0.0.1:8080/');
      // this.ws = new WebSocket('ws://10.1.1.234:8080/');
      this.ws.onmessage = (msg) => {
          // const audioBlob = new Blob([new Uint8Array(msg.data.buffer.data)]);
          const audioUrl = URL.createObjectURL(msg.data);
          const audio = new Audio(audioUrl);
          audio.play();
      };

        this.startWebStreaming();//
    }

  startWebStreaming = () => {
      navigator.mediaDevices.getUserMedia({audio: true})
          .then((stream) => {
              this.stream = stream;
              this.mediaRecorder = new MediaRecorder(this.stream);
              this.mediaRecorder.start();
              let audioChunks = [];

              this.mediaRecorder.ondataavailable = event => {
                  audioChunks.push(event.data);
              };

              this.mediaRecorder.onstop = _ => {
                  const audioBlob = new Blob(audioChunks);

                  // let reqData = new FormData();
                  // reqData.append('audioBlob', audioBlob);
                  //
                  // axios.post('http://127.0.0.1:34085/stream', reqData, {
                  //     headers: {'Content-Type': 'multipart/form-data'}})
                  //     .then( res => {
                  //         const audioBlob = new Blob([new Uint8Array(res.data.buffer.data)]);
                  //         const audioUrl = URL.createObjectURL(audioBlob);
                  //         const audio = new Audio(audioUrl);
                  //         audio.play();
                  //     })
                  //     .then( _ => {
                  //         this.mediaRecorder.start();
                  //     });
                  this.ws.send(audioBlob);
                  this.mediaRecorder.start();

                  // let arrayBuffer;
                  // let fileReader = new FileReader();
                  // fileReader.onload = (event) => {
                  //     arrayBuffer = event.target.result;
                  //     this.ws.send(audioBlob);
                  // };
                  // fileReader.readAsArrayBuffer(audioBlob);
              };

              this.interval = setInterval(() => {
                  audioChunks = [];
                  this.mediaRecorder.stop();
              }, 300);
          });
  };

  stopWebStreaming = () => {
      clearInterval(this.interval);
      this.stream.getTracks()[0].stop();
  };

  startRecording = () => {
      // const  mediaConstraints = {
      //     video: {
      //         mandatory: {
      //             minWidth: 800,
      //             minHeight: 640
      //         }
      //     }, audio: true
      // };
      navigator.mediaDevices.getUserMedia({audio: true})
          .then((stream) => {
              this.stream = stream;
              this.mediaRecorder = new MediaRecorder(this.stream);
              this.mediaRecorder.start();
              let audioChunks = [];

              this.mediaRecorder.ondataavailable = event => {
                  audioChunks.push(event.data);
              };

              this.mediaRecorder.onstop = _ => {
                  const audioBlob = new Blob(audioChunks);
                  const audioUrl = URL.createObjectURL(audioBlob);
                  const audio = new Audio(audioUrl);
                  audio.play();
              };

              // setTimeout(() => {
              //     this.mediaRecorder.stop();
              // }, 6000);
          });
    };

  stopRecording = () => {
      this.mediaRecorder.stop();
  };

  startStreaming = () => {
      navigator.mediaDevices.getUserMedia({audio: true})
          .then((stream) => {
              this.stream = stream;

              const audioUrl = window.URL.createObjectURL(this.stream);
              const audio = new Audio(audioUrl);
              audio.play();
              this.setState({url: '' + audioUrl});
      });
  };

  stopStreaming= () => {
      this.stream.getTracks()[0].stop();
  };

  render() {
    return (
      <div className="App">
          <hr/>
          <h1>V.O.I.P</h1>
          <hr/>
        {/*<input type="file" accept="audio/*;capture=microphone"/>*/}
        {/*<device type="media"></device>*/}
        {/*<button onClick={this.startStreaming}> Start streaming </button>*/}
        {/*<button onClick={this.stopStreaming}> Stop streaming </button>*/}
        {/*<hr/>*/}
        {/*<button onClick={this.startRecording}> Start recording </button>*/}
        {/*<button onClick={this.stopRecording}> Stop recording </button>*/}
        {/*<hr/>*/}
        {/*<button onClick={this.startWebStreaming}>Start webStreaming</button>*/}
        <h2 onClick={this.stopWebStreaming}><a href='#'>disconnect</a></h2>
      </div>
    );
  }
}

export default App;
