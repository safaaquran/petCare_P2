namespace PetCareJordan.Api.Services;

public class VaccineReminderHostedService(IServiceScopeFactory scopeFactory) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await RefreshRemindersAsync(stoppingToken);

        using var timer = new PeriodicTimer(TimeSpan.FromHours(6));
        while (await timer.WaitForNextTickAsync(stoppingToken))
        {
            await RefreshRemindersAsync(stoppingToken);
        }
    }

    private async Task RefreshRemindersAsync(CancellationToken stoppingToken)
    {
        using var scope = scopeFactory.CreateScope();
        var reminderService = scope.ServiceProvider.GetRequiredService<VaccineReminderService>();
        await reminderService.RefreshAsync();
    }
}
