import { FrequencyBands } from "../models/FrequencyBands";
import { TransientBands } from "../models/TransientBands";

export default class TransientDetector {

    private previous: FrequencyBands = {
        bass: 0,
        lowMid: 0,
        mid: 0,
        highMid: 0,
        treble: 0
    };

    private initialized = false;

    detect(current: FrequencyBands): TransientBands {

        // Establish baseline after long period of no music
        if (!this.initialized) {

            this.previous = { ...current };
            this.initialized = true;

            return {
                bass: 0,
                lowMid: 0,
                mid: 0,
                highMid: 0,
                treble: 0
            };
        }

        const transients: TransientBands = {
            bass:
                Math.max(
                    0,
                    current.bass -
                    this.previous.bass
                ),

            lowMid:
                Math.max(
                    0,
                    current.lowMid -
                    this.previous.lowMid
                ),

            mid:
                Math.max(
                    0,
                    current.mid -
                    this.previous.mid
                ),

            highMid:
                Math.max(
                    0,
                    current.highMid -
                    this.previous.highMid
                ),

            treble:
                Math.max(
                    0,
                    current.treble -
                    this.previous.treble
                )
        };

        this.previous = { ...current };

        return transients;
    }

    reset(): void {
        this.initialized = false;
    }
}