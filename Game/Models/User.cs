using System;
using System.Collections.Generic;

namespace Game.Models;

public partial class User
{
    public long UserId { get; set; }

    public string Name { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string? Image { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<Friend> FriendFriendNavigations { get; set; } = new List<Friend>();

    public virtual ICollection<Friend> FriendUsers { get; set; } = new List<Friend>();
}
