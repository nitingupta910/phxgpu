import Renderer from './renderer';

let Hooks = {};

Hooks.WebGPU = {
    mounted() {
        // WebGPU setup
        const canvas = document.getElementById("webgpu-canvas");
        if (!canvas) {
            console.error("Canvas element not found");
            return;
        }

        if (!navigator.gpu) {
            console.error("WebGPU is not supported by your browser.");
            return;
        }

        const renderer = new Renderer(canvas);
        renderer.main();
    }
};

export default Hooks;
