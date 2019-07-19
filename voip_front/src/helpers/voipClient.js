const config = {
    chunkSize: 300
};

export default class VoipClient {
    constructor(wsUrl) {
        this.ws = new WebSocket(wsUrl);
    }

    subscribe = () => {
        this.ws.onmessage = (msg) => {
            // const audioBlob = new Blob([new Uint8Array(msg.data.buffer.data)]);

            if (msg.data instanceof Blob) {
                const audioUrl = URL.createObjectURL(msg.data);
                const audio = new Audio(audioUrl);
                audio.play();
            }

            if (typeof msg.data === 'string') {
                const { payload, type } = JSON.parse(msg.data);

                switch (type) {
                    case 'notification': {
                        this.pushNotification(payload, { icon: '/favicon.ico' });
                        break;
                    }
                }
            }
        };
    };

    unsubscribe = () => {
        this.ws.close();
    };

    start = async () => {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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

            this.interval = setInterval( () => {
                audioChunks = [];
                this.mediaRecorder.stop();
            }, config.chunkSize);
        } catch (err) {
            console.error(err);
        }
    };

    stop = () => {
        clearInterval(this.interval);
        this.stream.getTracks()[0].stop();
    };

    static requestNotification = async () => {
        await Notification.requestPermission();
    };

    pushNotification = (message) => {
        if (Notification.permission === "granted") {
            new Notification(message);
        }
    };

    sendNotification = (message) => {
        this.ws.send(JSON.stringify({ type: 'notification', payload: message }));
    };
}
