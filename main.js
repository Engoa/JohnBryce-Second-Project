const renderTasks = () => {
  const drawTasks = document.querySelector(".tasks");
  let tasksHtml = "";
  ToDo.tasks.forEach((task, index) => {
    tasksHtml += `
        <div class="task" data-id="${index}">
          <div class="content">
            <input type="text" class="text" value="${task}" readonly spellcheck="false"   />
          </div>
          <div class="actions">
            <button class="edit" >Edit</button>
            <button class="delete" >Delete</button>
          </div>
        </div>

        `;
  });

  drawTasks.innerHTML = tasksHtml;

  const editBtn = document.querySelectorAll(".edit");
  editBtn.forEach((btn) => {
    btn.addEventListener("click", () => ToDo.editTask(btn.dataset.index));
  });
  const deleteBtn = document.querySelectorAll(".delete");
  deleteBtn.forEach((btn) => {
    btn.addEventListener("click", () => ToDo.deleteTask(btn.dataset.index));
  });
};
document.addEventListener("task-deleted", () => {
  renderTasks();
});

document.addEventListener("task-added", () => {
  renderTasks();
});
document.addEventListener("task-edited", () => {
  renderTasks();
});
document.addEventListener("task-created", () => {
  renderTasks();
});
