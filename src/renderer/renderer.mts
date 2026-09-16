import Visualizer from "./visualizer/Visualizer.mjs";

console.log("Renderer loaded");

const visualizer = new Visualizer();

visualizer.start();

window.audio.onData((data) => {
    visualizer.update(data);
});