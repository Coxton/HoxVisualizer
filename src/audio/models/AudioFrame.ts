export interface AudioFrame {
    data: Buffer;
    sampleRate: number;
    channels: number;
    timestamp: number;
}