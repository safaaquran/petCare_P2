namespace PetCareJordan.Api.Models;

public class VaccinationRecord
{
    public int Id { get; set; }
    public int PetId { get; set; }
    public Pet? Pet { get; set; }
    public int VetId { get; set; }
    public AppUser? Vet { get; set; }
    public string VaccineName { get; set; } = string.Empty;
    public DateTime? GivenOnUtc { get; set; }
    public DateTime DueDateUtc { get; set; }
    public bool IsCompleted { get; set; }
}
