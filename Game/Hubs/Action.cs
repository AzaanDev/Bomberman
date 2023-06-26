namespace PlayerActions;

public class Actions
{
    public string ConnectionId { get; set; }
    public string Action { get; set; }

    public Actions(string connectionId, string action)
    {
        ConnectionId = connectionId;
        Action = action;
    }
}