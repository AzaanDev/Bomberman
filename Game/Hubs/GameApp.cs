using PlayerClient.Model;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;
using System.Collections.Concurrent;
using PlayerActions;

namespace Game.Models;

public class GameApp
{
    public readonly string GameId;
    public List<Client> Players { get; set; }
    private bool Running;
    private readonly IHubContext<GameHub> hubContext;
    private ConcurrentQueue<Actions> inputQueue;



    public GameApp(string gameId, List<Client> players, IHubContext<GameHub> hubContext, ConcurrentQueue<Actions> inputQueue)
    {
        GameId = gameId;
        Players = players;
        Running = false;
        this.hubContext = hubContext;
        this.inputQueue = inputQueue;
    }

    public void Start()
    {
        Running = true;
        while (Running)
        {
            if (inputQueue.IsEmpty)
            {

            }
            else
            {
                ProcessInput();
            }
        }
    }

    private async void ProcessInput()
    {
        if (inputQueue.TryDequeue(out var action))
        {
            await UpdateWorld(action);
        }
    }

    private Task UpdateWorld(Actions action)
    {
        throw new NotImplementedException();
    }

    public async Task ProcessInputAsync(string input)
    {
        await hubContext.Clients.Group(GameId).SendAsync("GameState", input);
    }

    private bool IsGameOver()
    {

        return false;
    }

    private async void SendState()
    {
        await hubContext.Clients.Group(GameId).SendAsync("GameState");
    }
}