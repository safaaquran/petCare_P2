namespace PetCareJordan.Api.Models;

public class Notification
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public AppUser? User { get; set; }
    public NotificationType Type { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public DateTime TriggerDateUtc { get; set; }
    public bool IsRead { get; set; }
}
