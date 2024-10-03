defmodule PhxgpuWeb.PageLive do
  use PhxgpuWeb, :live_view

  def mount(_params, _session, socket) do
    # You can handle any setup here (e.g., assign variables)
    {:ok, assign(socket, :welcome_message, "Welcome to the LiveView Root Page!")}
  end

  def render(assigns) do
    ~H"""
    <div class="container">
      <h1><%= @welcome_message %></h1>
      <p>This is the root page served by Phoenix LiveView.</p>

      <div id="webgpu-container" phx-hook="WebGPU">
        <canvas id="webgpu-canvas" width="800" height="600"></canvas>
      </div>
    </div>
    """
  end
end
