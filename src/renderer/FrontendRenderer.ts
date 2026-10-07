import Visualizer from "../visualizer/Visualizer.mjs";
import type { VisualAudio } from "../audio/visual/models/VisualAudio.mjs";

export default class FrontendRenderer {

    private visualizer: Visualizer;

    constructor(
        onData: (
            callback: (data: VisualAudio) => void
        ) => void
    ) {

        this.visualizer =
            new Visualizer();

        onData(
            (data) => {
                this.update(data);
            }
        );
    }

    start(): void {

        this.visualizer.start();

    }

    update(data: VisualAudio): void {

        this.visualizer.update(data);

    }

}