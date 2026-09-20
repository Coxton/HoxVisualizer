import { FrequencyBands } from "./models/FrequencyBands";

export default class AudioSmoother {

    private current: FrequencyBands = {
        bass: 0,
        lowMid: 0,
        mid: 0,
        highMid: 0,
        treble: 0
    };


    private readonly attack = 0.35;
    private readonly release = 0.08;

    
    //smooth audio samples by either multiplying the result of target - current with either attack or release  
    smooth(target: FrequencyBands): FrequencyBands {

        this.current.bass =
            this.smoothValue(this.current.bass, target.bass);

        this.current.lowMid =
            this.smoothValue(this.current.lowMid, target.lowMid);

        this.current.mid =
            this.smoothValue(this.current.mid, target.mid);

        this.current.highMid =
            this.smoothValue(this.current.highMid, target.highMid);

        this.current.treble =
            this.smoothValue(this.current.treble, target.treble);

        return { ...this.current };
    }


    private smoothValue(current: number, target: number): number {

        const smoothing =
            target > current
                ? this.attack
                : this.release;

        return current + (target - current) * smoothing;
    }
}