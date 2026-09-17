import type { AudioSource } from "../models/AudioSource.js";
import type { AudioSourceProvider } from "./AudioSourceProvider.js";

interface NativeAudioSource {
    id: number;
    name: string;
    processId: number;
}

interface NativeAudioSessions {
    getSessions(): NativeAudioSource[];
}

const nativeAudio =
    require("../../../native/audio-sessions/build/Release/audio_sessions.node") as NativeAudioSessions;

export default class WindowsAudioSourceProvider
    implements AudioSourceProvider
{
    async getSources(): Promise<AudioSource[]> {
        const sessions = nativeAudio.getSessions();

        return sessions.map((session) => ({
            id: session.id,
            name: session.name,
            processId: session.processId
        }));
    }
}