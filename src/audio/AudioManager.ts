import AudioCapture from "./capture/AudioCapture";
import type { AudioFrame } from "./models/AudioFrame";
import type { AudioSource } from "./models/AudioSource";
import WindowsAudioSourceProvider from "./sources/WindowsAudioSourceProvider";

export default class AudioManager {
    private capture = new AudioCapture();
    private sourceProvider = new WindowsAudioSourceProvider();

    async getSources(): Promise<AudioSource[]> {
        return this.sourceProvider.getSources();
    }

    startSystemAudio(onAudioFrame: (frame: AudioFrame) => void): void {
        this.capture.startSystemAudio(onAudioFrame);
    }

    startProcessAudio(
        processId: number,
        onAudioFrame: (frame: AudioFrame) => void
    ): void {
        this.stop();

        this.capture.startProcessAudio(
            processId,
            onAudioFrame
        );
    }

    stop(): void {
        this.capture.stop();
    }
}