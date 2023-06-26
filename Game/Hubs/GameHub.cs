using System.Collections.Concurrent;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using PlayerClient.Model;
using Game.Models;
using PlayerActions;

public class GameHub : Hub
{
    private readonly IHubContext<GameHub> hubContext;

    private static Queue<Client> gameQueue = new Queue<Client>();
    private static HashSet<Client> players = new HashSet<Client>();
    private static Dictionary<string, Thread> gameThreads = new Dictionary<string, Thread>();
    private static Dictionary<string, ConcurrentQueue<Actions>> gameInputQueues = new Dictionary<string, ConcurrentQueue<Actions>>();

    public GameHub(IHubContext<GameHub> hubContext)
    {
        this.hubContext = hubContext;
    }

    [Authorize]
    public async Task JoinQueue()
    {
        var user = Context.User;
        var userId = user?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var name = user?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        Console.WriteLine(name);
        if (userId == null || name == null)
        {
            return;
        }
        Client client = new Client(userId, Context.ConnectionId, name);
        if (players.Contains(client))
        {
            return;
        }
        players.Add(client);
        gameQueue.Enqueue(client);
        if (gameQueue.Count() >= 4)
        {
            Console.WriteLine("Game Created");
            await CreateGame();
        }
        else
        {
            await Groups.AddToGroupAsync(client.ConnectionId, "Queue");
        }
        await Clients.Group("Queue").SendAsync("ReceiveMessage", "Hello, clients in the Queue group!");
    }

    public async Task CreateGame()
    {
        string roomName = GenerateGameRoomName();
        List<Client> players = new List<Client>();
        for (int i = 0; i < 4; i++)
        {
            if (gameQueue.TryDequeue(out var player))
            {
                players.Add(player);
                await Groups.RemoveFromGroupAsync(player.ConnectionId, "Queue");
                await Groups.AddToGroupAsync(player.ConnectionId, roomName);

            }
            else
            {
                break;
            }
        }
        ConcurrentQueue<Actions> inputQueue = new ConcurrentQueue<Actions>();
        GameApp game = new GameApp(roomName, players, hubContext, inputQueue);
        Thread gameThread = new Thread(() => game.Start());
        gameThreads.Add(roomName, gameThread);
        gameInputQueues.Add(roomName, inputQueue);
        gameThread.Start();
        await Clients.Group(roomName).SendAsync("Game Started", roomName);
    }


    [Authorize]
    public async void LeaveQueue()
    {
        var user = Context.User;
        var userId = user?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var name = user?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null || name == null)
        {
            return;
        }
        Client client = new Client(userId, Context.ConnectionId, name);
        HashSet<Client> hashSet = new HashSet<Client>(gameQueue);
        hashSet.Remove(client);
        players.Remove(client);
        gameQueue = new Queue<Client>(hashSet);
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, "Queue");
        await Clients.Group("Queue").SendAsync(gameQueue.Count().ToString());
    }

    [Authorize]
    public void SendInput(string roomId, string input)
    {
        Console.WriteLine(input);
        Actions action = new Actions(Context.ConnectionId, input);
        if (input == null)
        {
            return;
        }
        if (gameInputQueues.TryGetValue(roomId, out ConcurrentQueue<Actions> inputQueue))
        {
            inputQueue.Enqueue(action);
        }
        else
        {
            return;
        }
    }









    public string GenerateGameRoomName()
    {
        string baseName = "GameRoom";
        string uniqueId = Guid.NewGuid().ToString("N");

        return baseName + "_" + uniqueId;
    }
}
