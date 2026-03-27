namespace PetCareJordan.Api.Models;

public class MedicalRecord
{
    public int Id { get; set; }
    public int PetId { get; set; }
    public Pet? Pet { get; set; }
    public int VetId { get; set; }
    public AppUser? Vet { get; set; }
    public string VisitReason { get; set; } = string.Empty;
    public string Diagnosis { get; set; } = string.Empty;
    public string Treatment { get; set; } = string.Empty;
    public DateTime VisitDateUtc { get; set; }
}
