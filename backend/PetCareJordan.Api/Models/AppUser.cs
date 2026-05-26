namespace PetCareJordan.Api.Models;

public class AppUser
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public UserRole Role { get; set; }

    public ICollection<Pet> OwnedPets { get; set; } = new List<Pet>();
    public ICollection<MedicalRecord> MedicalRecordsAuthored { get; set; } = new List<MedicalRecord>();
    public ICollection<VaccinationRecord> VaccinationsAuthored { get; set; } = new List<VaccinationRecord>();
    public ICollection<ChatConversation> UserConversations { get; set; } = new List<ChatConversation>();
    public ICollection<ChatConversation> VetConversations { get; set; } = new List<ChatConversation>();
    public ICollection<ChatMessage> ChatMessagesSent { get; set; } = new List<ChatMessage>();
}
