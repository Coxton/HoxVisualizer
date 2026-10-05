import { FrequencyBands } from "../models/FrequencyBands";
import { TransientBands } from "../models/TransientBands";

export default class TransientDetector {

    private baseline: FrequencyBands = {
        bass: 0,
        lowMid: 0,
        mid: 0,
        highMid: 0,
        treble: 0
    };

    private initialized = false;

    private readonly baselineRise = 0.08;
    private readonly baselineFall = 0.02;

    private readonly threshold = 0.08;

    detect(
        current: FrequencyBands
    ): TransientBands {

        if (!this.initialized) {

            this.baseline =
                { ...current };

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
                this.detectAttack(
                    current.bass,
                    this.baseline.bass
                ),

            lowMid:
                this.detectAttack(
                    current.lowMid,
                    this.baseline.lowMid
                ),

            mid:
                this.detectAttack(
                    current.mid,
                    this.baseline.mid
                ),

            highMid:
                this.detectAttack(
                    current.highMid,
                    this.baseline.highMid
                ),

            treble:
                this.detectAttack(
                    current.treble,
                    this.baseline.treble
                )
        };


        this.baseline.bass =
            this.updateBaseline(
                this.baseline.bass,
                current.bass
            );

        this.baseline.lowMid =
            this.updateBaseline(
                this.baseline.lowMid,
                current.lowMid
            );

        this.baseline.mid =
            this.updateBaseline(
                this.baseline.mid,
                current.mid
            );

        this.baseline.highMid =
            this.updateBaseline(
                this.baseline.highMid,
                current.highMid
            );

        this.baseline.treble =
            this.updateBaseline(
                this.baseline.treble,
                current.treble
            );


        return transients;
    }


    reset(): void {

        this.initialized =
            false;

        this.baseline = {
            bass: 0,
            lowMid: 0,
            mid: 0,
            highMid: 0,
            treble: 0
        };
    }


    private detectAttack(
        current: number,
        baseline: number
    ): number {

        const difference =
            current -
            baseline;


        if (
            difference <=
            this.threshold
        ) {
            return 0;
        }


        return Math.min(
            1,
            (
                difference -
                this.threshold
            ) /
            (1 - this.threshold)
        );
    }


    private updateBaseline(
        current: number,
        target: number
    ): number {

        const response =
            target > current
                ? this.baselineRise
                : this.baselineFall;


        return (
            current +
            (target - current) *
            response
        );
    }
}