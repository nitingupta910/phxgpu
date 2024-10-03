defmodule PhxgpuWeb.PageLive do
  use PhxgpuWeb, :live_view

  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  def render(assigns) do
    ~H"""
    <div class="container">
      <div id="webgpu-container" phx-hook="WebGPU">
        <canvas id="webgpu-canvas" width="800" height="600"></canvas>
      </div>
    </div>
    """
  end
end
