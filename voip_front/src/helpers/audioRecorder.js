export default class AudioRecorder {
    start = async () => {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(this.stream);
            this.mediaRecorder.start();
            let audioChunks = [];

            this.mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };

            this.mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks);
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);
                audio.play();
            };

            setTimeout(this.stop, 6000);
        } catch (err) {
            console.error(err);
        }
    };

    stop = () => {
        this.mediaRecorder.stop();
        this.stream.getTracks()[0].stop();
    }
}
