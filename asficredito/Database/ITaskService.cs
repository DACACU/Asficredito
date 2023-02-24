namespace asficredito.Database
{
    public interface ITaskService
    {
        Task DeleteTask(Guid id);
        Task<List<Tasks>> getAllTask();
        Task<List<Tasks>> getTaskDate(string startDate, string finalDate);
        Task InsertTask(Tasks task);
        Task UpdateTask(Tasks task);
    }
}
