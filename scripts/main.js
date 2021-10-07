const renderTasks = () => {
  let tasksHtml = "";
  ToDo.tasks.forEach((task, index) => {
    const isCompletedClass = task.completed ? "completed" : "";
    tasksHtml += `
    <div class="task-wrapper">
        <div class="task ${isCompletedClass}"  
          data-id="${index}">
          <div class="content">
            <p class="text" spellcheck='false'>${task.text}</p>
          </div>
          <div class="actions">
            <button class="edit" data-id="${index}" >
            <i class="fas fa-edit editbtn"></i>
            <i class="fas fa-save savebtn"></i>
            </button>
            <button class="delete" data-id="${index}" >
            <i class="fas fa-trash-alt"></i>
            </button>
          </div>
          <div class="task__status">
          <i class="fas fa-check-square"></i>
          </div>
        </div>
     </div>
        `;
  });

  $(".tasks").html(tasksHtml);

  const editBtn = document.querySelectorAll(".edit");
  editBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      ToDo.editTask(btn.dataset.id);
    });
  });

  const deleteBtn = document.querySelectorAll(".delete");
  deleteBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      ToDo.deleteTask(btn.dataset.id);
    });
  });

  const task = document.querySelectorAll(".task");
  task.forEach((btn) => {
    btn.addEventListener("dblclick", () => {
      ToDo.toggleTask(btn.dataset.id);
    });
  });

  const deleteAll = document.querySelector(".delete-all");
  deleteAll.addEventListener("click", () => ToDo.deleteAllTasks());
};

const renderTaskHeader = () => {
  const drawTaskHeader = document.querySelector(".task-list--header");
  const modalClass = ToDo.tasks.length <= 0 ? "hide-btn" : ``;
  drawTaskHeader.innerHTML = `
  <h2>Tasks</h2>
   <button class="open-modal ${modalClass}">Delete All</button>
  `;
  // Open Delete Modal
  $(".open-modal").click(() => openModal());
};

let isOpen = false;
const deleteModal = document.querySelector(".modal");
const deleteModalOverlay = document.querySelector(".modal__overlay");

const openModal = () => {
  if (!isOpen) {
    deleteModal.classList.add("modal--active");
    deleteModalOverlay.classList.add("overlay--active");
    isOpen = true;
  }
};
const closeModal = () => {
  if (isOpen) {
    deleteModal.classList.remove("modal--active");
    deleteModalOverlay.classList.remove("overlay--active");
    isOpen = false;
  }
};

document.addEventListener("tasks-updated", () => {
  renderTasks();
  renderTaskHeader();
});
