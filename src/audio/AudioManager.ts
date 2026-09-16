import AudioCapture from "./capture/AudioCapture";
import { AudioFrame } from "./models/AudioFrame";

export default class AudioManager {

    private capture = new AudioCapture();

    start(onAudioFrame: (frame: AudioFrame) => void): void {
        this.capture.startSystemAudio(onAudioFrame);
    }

    stop(): void {
        this.capture.stop();
    }
}