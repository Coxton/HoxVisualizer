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

    async startDefaultAudio(
        onAudioFrame: (frame: AudioFrame) => void
    ): Promise<void> {

        const sources =
            await this.getSources();

        const spotify =
            sources.find(
                source =>
                    source.name
                        .toLowerCase()
                        .includes("spotify")
            );

        if (spotify) {
            this.startProcessAudio(
                spotify.processId,
                onAudioFrame
            );

            return;
        }

        console.log(
            "Spotify not found"
        );

/*         this.startSystemAudio(
            onAudioFrame
        ); */
    }

    stop(): void {
        this.capture.stop();
    }
}