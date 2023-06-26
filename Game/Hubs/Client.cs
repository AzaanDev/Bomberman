
namespace PlayerClient.Model;

public class Client
{
    public string UserId { get; set; }

    public string ConnectionId { get; set; }
    public string Name { get; set; }

    public Client(string userId, string connectionId, string name)
    {
        UserId = userId;
        ConnectionId = connectionId;
        Name = name;
    }

}