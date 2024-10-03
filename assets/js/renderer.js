class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
    }
    async initWebGPU() {
        // Check if WebGPU is supported
        if (!navigator.gpu) {
            console.error("WebGPU is not supported by your browser.");
            return null;
        }

        // Request the GPU adapter
        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) {
            console.error("Failed to get GPU adapter.");
            return null;
        }

        // Request the device
        const device = await adapter.requestDevice();

        // Get the WebGPU context from the canvas
        const context = this.canvas.getContext("webgpu");

        // Configure the canvas context
        const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
        context.configure({
            device: device,
            format: presentationFormat,
            alphaMode: "premultiplied"
        });

        this.device = device;
        this.context = context;
        this.presentationFormat = presentationFormat;
    }

    createRenderPipeline() {
        // Create a simple shader (WGSL) for rendering
        const shaderModule = this.device.createShaderModule({
            code: `
      @vertex
      fn vs_main(@builtin(vertex_index) vertexIndex : u32) -> @builtin(position) vec4<f32> {
        var pos = array<vec2<f32>, 3>(
          vec2<f32>(0.0, 0.5),
          vec2<f32>(-0.5, -0.5),
          vec2<f32>(0.5, -0.5)
        );
        return vec4<f32>(pos[vertexIndex], 0.0, 1.0);
      }

      @fragment
      fn fs_main() -> @location(0) vec4<f32> {
        return vec4<f32>(0.4, 0.8, 1.0, 1.0); // Blue color
      }
    `
        });

        // Define the pipeline
        this.pipeline = this.device.createRenderPipeline({
            vertex: {
                module: shaderModule,
                entryPoint: "vs_main",
            },
            fragment: {
                module: shaderModule,
                entryPoint: "fs_main",
                targets: [{
                    format: this.presentationFormat,
                }],
            },
            primitive: {
                topology: "triangle-list",
            },
            layout: "auto",
        });
    }

    renderLoop() {
        const frame = () => {
            // Get the current texture from the canvas
            const commandEncoder = this.device.createCommandEncoder();
            const textureView = this.context.getCurrentTexture().createView();

            // Create the render pass descriptor
            const renderPassDescriptor = {
                colorAttachments: [{
                    view: textureView,
                    loadOp: 'clear',
                    clearValue: { r: 0.3, g: 0.3, b: 0.8, a: 1.0 }, // Clear with blueish color
                    storeOp: 'store',
                }],
            };

            // Begin the render pass
            const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
            passEncoder.setPipeline(this.pipeline);
            passEncoder.draw(3, 1, 0, 0); // Draw the triangle
            passEncoder.end();

            // Submit the commands to the GPU
            this.device.queue.submit([commandEncoder.finish()]);

            // Call the next frame
            requestAnimationFrame(frame);
        }

        // Start the render loop
        requestAnimationFrame(frame);
    }

    async main() {
        await this.initWebGPU();
        if (!this.device) {
            return;
        }
        this.createRenderPipeline();
        this.renderLoop();
    }
}

export default Renderer;