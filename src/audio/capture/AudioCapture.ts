
import loopback from "loopback-capture";
import { AudioFrame } from "../models/AudioFrame";

export default class AudioCapture {
    private capture =
        new loopback.LoopbackCapture();

    startSystemAudio(
        onAudioData: (frame: AudioFrame) => void
    ): void {
        console.log("Starting system-wide audio capture");

        this.capture.startSystemAudio(
            (data: Buffer) => {
                console.log(
                    "System audio callback received:",
                    data.length
                );

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

    startProcessAudio(
        processId: number,
        onAudioData: (frame: AudioFrame) => void
    ): void {
        console.log(
            "Starting process capture for PID:",
            processId
        );

        let frameCount = 0;
        let lastLog = Date.now();

        this.capture.start(
            processId,
            true,
            (data: Buffer) => {
                frameCount++;

                const now = Date.now();

                if (now - lastLog >= 1000) {
                    const sampleCount =
                        Math.floor(data.length / 2);

                    let sumSquares = 0;
                    let nonZeroSamples = 0;

                    for (
                        let offset = 0;
                        offset + 1 < data.length;
                        offset += 2
                    ) {
                        const sample =
                            data.readInt16LE(offset);

                        sumSquares += sample * sample;

                        if (sample !== 0) {
                            nonZeroSamples++;
                        }
                    }

                    const rms = sampleCount > 0
                        ? Math.sqrt(
                            sumSquares / sampleCount
                        ) / 32768
                        : 0;

                    frameCount = 0;
                    lastLog = now;
                }

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
