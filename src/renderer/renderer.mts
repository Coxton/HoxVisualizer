import Visualizer from "./visualizer/Visualizer.mjs";



const visualizer = new Visualizer();


//start the main visualizer process
visualizer.start();


//constantly update the visualizer with incoming audio
window.audio.onData((data) => {
    visualizer.update(data);
});