import loopback from "loopback-capture";
import { AudioFrame } from "../models/AudioFrame";

export default class AudioCapture {

    private capture = new loopback.LoopbackCapture();


    startSystemAudio(onAudioData: (frame: AudioFrame) => void): void {
        this.capture.startSystemAudio((data: Buffer) => {


            const frame: AudioFrame = {
                data,
                sampleRate: 48000,
                channels: 2,
                timestamp: Date.now()
            };

            onAudioData(frame);

        });
    }

        startProcessAudio(
        processId: number,
        onAudioData: (frame: AudioFrame) => void
    ): void {
        this.capture.start(
            processId,
            false,
            (data: Buffer) => {
                const frame: AudioFrame = {
                    data,
                    sampleRate: 48000,
                    channels: 2,
                    timestamp: Date.now()
                };

                onAudioData(frame);
            }
        );
    }

    stop(): void {
        this.capture.stop();
    }

}