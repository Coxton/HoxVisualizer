import Visualizer from "../visualizer/Visualizer.mjs";

const visualizer =
    new Visualizer();

visualizer.start();

window.audio.onData(
    (data) => {

        visualizer.update(
            data as Parameters<
                typeof visualizer.update
            >[0]
        );
    }
);