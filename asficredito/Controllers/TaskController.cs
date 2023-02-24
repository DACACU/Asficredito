using asficredito.Database;
using Microsoft.AspNetCore.Mvc;

namespace asficredito.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TaskController : Controller
    {
        private readonly ITaskService taskService;
        public TaskController(ITaskService service)
        {
            this.taskService = service;
        }

        [HttpGet]
        public async Task<IActionResult> getAllTask()
        {
            return Ok(await taskService.getAllTask());
        }

        /// <summary>
        /// Create a Task.
        /// </summary>
        /// <param name="tasks"></param>
        /// <returns>A newly created task</returns>
        /// <response code="201">Returns the newly created task</response>
        /// <response code="400">If the task is null</response>  
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> InsertClient([FromBody] Tasks tasks)
        {
            if (tasks == null)
            {
                return BadRequest();
            }
            if (tasks.TaskName == string.Empty)
            {
                ModelState.AddModelError("Task name", "The task name is empty");
            }
            if (tasks.Time == TimeOnly.MinValue)
            {
                ModelState.AddModelError("Time", "Time is empty");
            }
            if (tasks.Date == DateTime.MinValue)
            {
                ModelState.AddModelError("Date", "Date is empty");
            }
            if (tasks.Owner == string.Empty)
            {
                ModelState.AddModelError("Onwer", "The owner is empty");
            }
            if (tasks.Description == string.Empty)
            {
                ModelState.AddModelError("Description", "The description is empty");
            }
            await taskService.InsertTask(tasks);
            return Created("Task created", true);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateClient([FromBody] Tasks tasks, Guid id)
        {
            if (tasks == null)
            {
                return BadRequest();
            }
            if (tasks.TaskName == string.Empty)
            {
                ModelState.AddModelError("Task name", "The task name is empty");
            }
            if (tasks.Time == TimeOnly.MinValue)
            {
                ModelState.AddModelError("Time", "Time is empty");
            }
            if (tasks.Date == DateTime.MinValue)
            {
                ModelState.AddModelError("Date", "Date is empty");
            }
            if (tasks.Owner == string.Empty)
            {
                ModelState.AddModelError("Onwer", "The owner is empty");
            }
            if (tasks.Description == string.Empty)
            {
                ModelState.AddModelError("Description", "The description is empty");
            }
            tasks.Id = id;
            await taskService.UpdateTask(tasks);
            return Created("Task updated", true);
        }

        /// <summary>
        /// Deletes a specific Client.
        /// </summary>
        /// <param name="id"></param>    
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClient(Guid id)
        {
            await taskService.DeleteTask(id);
            return NoContent();
        }

        [HttpGet("{startDate}/{finalDate}")]
        public async Task<IActionResult> getTaskDate(string startDate, string finalDate)
        {
            return Ok(await taskService.getTaskDate(startDate, finalDate));
        }
    }
}
