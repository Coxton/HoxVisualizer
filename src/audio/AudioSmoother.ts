import { FrequencyBands } from "./models/FrequencyBands";

export default class AudioSmoother {

    private current: FrequencyBands = {
        bass: 0,
        lowMid: 0,
        mid: 0,
        highMid: 0,
        treble: 0
    };

    private readonly smoothing = 0.2;

    smooth(target: FrequencyBands): FrequencyBands {

        this.current.bass +=
            (target.bass - this.current.bass) * this.smoothing;

        this.current.lowMid +=
            (target.lowMid - this.current.lowMid) * this.smoothing;

        this.current.mid +=
            (target.mid - this.current.mid) * this.smoothing;

        this.current.highMid +=
            (target.highMid - this.current.highMid) * this.smoothing;

        this.current.treble +=
            (target.treble - this.current.treble) * this.smoothing;

        return { ...this.current };
    }
}