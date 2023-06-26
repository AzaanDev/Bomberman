using System;
using System.Collections.Generic;

namespace Game.Models;

public partial class Friend
{
    public long Id { get; set; }

    public long UserId { get; set; }

    public long FriendId { get; set; }

    public string Status { get; set; } = null!;

    public virtual User FriendNavigation { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
