import loopback from "loopback-capture";

export default class AudioCapture {

    private capture = new loopback.LoopbackCapture();

    startSystemAudio(onAudioData: (data: Buffer) => void): void {
        this.capture.startSystemAudio(onAudioData);
    }

    stop(): void {
        this.capture.stop();
    }

}