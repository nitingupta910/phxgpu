defmodule Phxgpu.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      PhxgpuWeb.Telemetry,
      {DNSCluster, query: Application.get_env(:phxgpu, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: Phxgpu.PubSub},
      # Start the Finch HTTP client for sending emails
      {Finch, name: Phxgpu.Finch},
      # Start a worker by calling: Phxgpu.Worker.start_link(arg)
      # {Phxgpu.Worker, arg},
      # Start to serve requests, typically the last entry
      PhxgpuWeb.Endpoint
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Phxgpu.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    PhxgpuWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
