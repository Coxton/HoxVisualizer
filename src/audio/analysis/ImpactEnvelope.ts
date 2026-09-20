export default class ImpactEnvelope {

    private current = 0;

    private readonly attack = 0.9;
    private readonly release = 0.12;

    process(impact: number): number {

        const smoothing =
            impact > this.current
                ? this.attack
                : this.release;

        this.current +=
            (impact - this.current) * smoothing;

        return this.current;
    }
}