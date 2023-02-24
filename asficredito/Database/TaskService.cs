using Microsoft.EntityFrameworkCore;
using NLog;

namespace asficredito.Database
{
    public class TaskService : ITaskService
    {
        TaskServiceContext context;
        private static Logger logger = LogManager.GetCurrentClassLogger();
        public TaskService(TaskServiceContext dbcontext)
        {
            context = dbcontext;
        }

        public async Task DeleteTask(Guid id)
        {
            var filter = context.Tasks.Find(id);
            try
            {
                context.Remove(filter);
                await context.SaveChangesAsync();
                logger.Info("Info: the task has been deleted");
            }
            catch (Exception ex)
            {
                logger.Fatal("Fatal: The task could not be deleted, Error: " + ex);
            }
        }

        public async Task<List<Tasks>> getAllTask()
        {
            return await context.Tasks.ToListAsync();
            try
            {
                logger.Info("Info: The task have been obtained successfully");
            }
            catch (Exception e)
            {
                logger.Fatal("Fatal: The task could not be obtained successfully, Error: " + e);
            }
        }

        public async Task<List<Tasks>> getTaskDate(string startDate, string finalDate)
        {
            var inDate = DateTime.Parse(startDate);
            var outDate = DateTime.Parse(finalDate);
            return await context.Tasks.Where(t => t.Date >= inDate && t.Date <= outDate).ToListAsync();
            try
            {
                logger.Info("Info: The task have been obtained successfully");
            }
            catch (Exception e)
            {
                logger.Fatal("Fatal: The task could not be obtained successfully, Error: " + e);
            }
        }

        public async Task InsertTask(Tasks task)
        {
            try
            {
                context.Tasks.Add(task);
                await context.SaveChangesAsync();
                logger.Info("Info: The Task was inserted");
            }
            catch (Exception e)
            {
                logger.Fatal("Fatal: The Task was not inserted, Error: " + e);
                throw;
            }
        }

        public async Task UpdateTask(Tasks task)
        {
            var filter = context.Tasks.Find(task.Id);
            try
            {
                if (filter != null)
                {
                    filter.Description = task.Description;
                    filter.Comment = task.Comment;
                    filter.TaskName = task.TaskName;
                    filter.Date = task.Date;
                    filter.Id = task.Id;
                    filter.Owner = task.Owner;
                    filter.Time = task.Time;

                    await context.SaveChangesAsync();
                    logger.Info("Info: The task was updated");
                }
            }
            catch (Exception e)
            {
                logger.Fatal("Fatal: The task was not updated, Error: " + e);
            }
        }
    }
}
