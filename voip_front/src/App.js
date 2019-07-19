import React, { Component } from 'react';
import axios from 'axios';
import * as RecordRTC from 'recordrtc';
import './App.css';
import VoipClient from './helpers/voipClient';
import AudioRecorder from './helpers/audioRecorder';

import firebase from 'firebase/app';
const firebaseConfig = {
    apiKey: "AIzaSyB7fz9X8h3qxT8ianOAxZq-XXbxGDnXWNQ",
    authDomain: "voipweb-aunea.firebaseapp.com",
    databaseURL: "https://voipweb-aunea.firebaseio.com",
    projectId: "voipweb-aunea",
    storageBucket: "",
    messagingSenderId: "457837724296",
    appId: "1:457837724296:web:c1aceae25e8f0359"
};
firebase.initializeApp(firebaseConfig);

class App extends Component {
    state = {
        listening: false,
        recording: false,
        websocketUrl: '',
        notificationMessage: ''
    };

    componentWillMount() {
        VoipClient.requestNotification();
    }

    onChanged = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    subscribeWebStream = () => {
        this.voipClient = new VoipClient(this.state.websocketUrl);
        this.voipClient.subscribe();
        this.setState({ listening: true });
    };

    unsubscribeWebStream = () => {
        this.voipClient.unsubscribe();
        this.setState({ listening: false });
    };

    startWebStreaming = async () => {
        await this.voipClient.start();
        this.setState({ recording: true });
    };

    stopWebStreaming = () => {
        this.voipClient.stop();
        this.setState({ recording: false });
    };

    sendNotification = () => {
        this.voipClient.sendNotification(this.state.notificationMessage);
        this.setState({ notificationMessage: '' });
    };

    // _________

    startRecording = async () => {
        this.audioRecorder = new AudioRecorder();
        await this.audioRecorder.start();
    };

    stopRecording = () => {
        this.audioRecorder.stop();
    };

    //________

    startStreaming = () => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                this.stream = stream;

                const audioUrl = window.URL.createObjectURL(this.stream);
                const audio = new Audio(audioUrl);
                audio.play();
                this.setState({ url: '' + audioUrl });
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
                <input
                    onChange={this.onChanged}
                    name="websocketUrl"
                    value={this.state.websocketUrl}
                    placeholder="Websocket Url"/>
                <br/>
                {
                    this.state.listening ?
                        <button onClick={this.unsubscribeWebStream}>
                            Stop listening to the conversation
                        </button>
                        :
                        <button
                            onClick={this.subscribeWebStream}
                            disabled={!this.state.websocketUrl}
                        >
                            Start listening to the conversation
                        </button>
                }
                {
                    this.state.recording ?
                        <button
                            disabled={!this.state.recording}
                            onClick={this.stopWebStreaming}
                        >
                            Stop recording and streaming voice
                        </button>
                        :
                        <button
                            onClick={this.startWebStreaming}
                            disabled={!this.state.listening}
                        >
                            Start recording and streaming voice
                        </button>
                }

                <br/>
                <input
                    onChange={this.onChanged}
                    name="notificationMessage"
                    disabled={!this.state.listening}
                    value={this.state.notificationMessage}
                    placeholder="Type your message"/>
                <button
                    onClick={this.sendNotification}
                    disabled={!this.state.notificationMessage}
                >
                    Send notification
                </button>

                <hr/>


                <div>
                    <h1>Audio Recorder</h1>
                    <hr/>
                    <button onClick={this.startRecording}> Start recording </button>
                    <button onClick={this.stopRecording}> Stop recording </button>
                </div>

                <hr/>
                {/*<input type="file" accept="audio/*;capture=microphone"/>*/}
                {/*<device type="media"></device>*/}
            </div>
        );
    }
}

export default App;
