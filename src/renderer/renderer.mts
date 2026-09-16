console.log("Renderer loaded");

const visualizer = document.getElementById("visualizer");

if (!visualizer) {
    throw new Error("Visualizer element not found");
}

window.audio.onData((data) => {
    const scale = 1 + data.volume * 10;

    visualizer.style.setProperty(
        "--audio-scale",
        scale.toString()
    );
});