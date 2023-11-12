/**
 * This example shows how to load a GEXF graph file (using the dedicated
 * graphology parser), and display it with some basic map features: Zoom in and
 * out buttons, reset zoom button, and a slider to increase or decrease the
 * quantity of labels displayed on screen.
 */

import Sigma from "sigma";
import Graph from "graphology";
import { parse } from "graphology-gexf/browser";

// Retrieve the input element for file selection:
const fileInput = document.getElementById("file-input") as HTMLInputElement;

// Add an event listener to trigger when a file is selected:
fileInput.addEventListener("change", (event) => {
  if (event.target instanceof HTMLInputElement) {
    // Ensure event.target.files is not null
    const files = event.target.files;

    if (files && files.length > 0) {
      const file = files[0];

      // Read the selected file:
      const reader = new FileReader();

      reader.onload = (e) => {
        // Ensure e.target is not null
        if (e.target) {
          // Parse GEXF string:
          const gexf = e.target.result as string;
          const graph = parse(Graph, gexf);

          // Retrieve some useful DOM elements:
          const container = document.getElementById("sigma-container") as HTMLElement;
          const zoomInBtn = document.getElementById("zoom-in") as HTMLButtonElement;
          const zoomOutBtn = document.getElementById("zoom-out") as HTMLButtonElement;
          const zoomResetBtn = document.getElementById("zoom-reset") as HTMLButtonElement;
          const labelsThresholdRange = document.getElementById("labels-threshold") as HTMLInputElement;

          // Instanciate sigma:
          const renderer = new Sigma(graph, container, {
            minCameraRatio: 0.1,
            maxCameraRatio: 10,
          });
          const camera = renderer.getCamera();

          // Bind zoom manipulation buttons
          zoomInBtn.addEventListener("click", () => {
            camera.animatedZoom({ duration: 600 });
          });
          zoomOutBtn.addEventListener("click", () => {
            camera.animatedUnzoom({ duration: 600 });
          });
          zoomResetBtn.addEventListener("click", () => {
            camera.animatedReset({ duration: 600 });
          });

          // Bind labels threshold to range input
          labelsThresholdRange.addEventListener("input", () => {
            renderer.setSetting("labelRenderedSizeThreshold", +labelsThresholdRange.value);
          });

          // Set proper range initial value:
          labelsThresholdRange.value = renderer.getSetting("labelRenderedSizeThreshold") + "";
        }
      };

      reader.readAsText(file);
    }
  }
});
