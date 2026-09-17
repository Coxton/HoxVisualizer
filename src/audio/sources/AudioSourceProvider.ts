import type { AudioSource } from "../models/AudioSource.js";

export interface AudioSourceProvider {
    getSources(): Promise<AudioSource[]>;
}