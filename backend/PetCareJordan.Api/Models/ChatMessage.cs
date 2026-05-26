namespace PetCareJordan.Api.Models;

public class ChatMessage
{
    public int Id { get; set; }
    public int ConversationId { get; set; }
    public ChatConversation? Conversation { get; set; }
    public int SenderId { get; set; }
    public AppUser? Sender { get; set; }
    public string Message { get; set; } = string.Empty;
    public DateTime SentAtUtc { get; set; }
    public bool IsReadByRecipient { get; set; }
    public DateTime? ReadAtUtc { get; set; }
}
