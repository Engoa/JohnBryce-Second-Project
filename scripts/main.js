const addToggleTaskListeners = () => {
  const task = document.querySelectorAll(".task");
  task.forEach((btn) => {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    btn.addEventListener(isMobile ? "click" : "dblclick", () => {
      ToDo.toggleTask(btn.dataset.id);
    });
  });
};

const renderTasks = () => {
  let tasksHtml = "";
  ToDo.tasks.forEach((task, index) => {
    const isCompletedClass = task.completed ? "completed" : "";
    const dateAndTime = new Date(task.date + "," + task.time).toLocaleString();
    tasksHtml += `
    <div class="task-wrapper">
        <div class="task ${isCompletedClass}"  
          data-id="${index}">
          <div class="content">
            <p class="text" spellcheck='false'>${task.text}</p>
            <div class="times">
            <span class="time">${dateAndTime}</span>
            </div>
          </div>
          <div class="actions">
            <button class="edit" data-id="${index}" >
            <i class="fas fa-edit editbtn" title='Edit Task'></i>
            <i class="fas fa-save savebtn" title='Save Task'></i>
            </button>
            <button class="delete" data-id="${index}" title='Delete Task' >
            <i class="fas fa-trash-alt"></i>
            </button>
          </div>
          <div class="task__status" title='Task Completed'>
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

  const deleteAll = document.querySelector(".delete-all");
  deleteAll.addEventListener("click", () => ToDo.deleteAllTasks());

  addToggleTaskListeners();
};

const renderTaskHeader = () => {
  const drawTaskHeader = document.querySelector(".task-list--header");
  const modalClass = ToDo.tasks.length <= 0 ? "hide-btn" : ``;
  drawTaskHeader.innerHTML = `
  <h2 class="${modalClass}">Tasks</h2>
  <h6 class="${modalClass}">
    Double click on a task to complete ✔
   </h6>
  <button class="open-modal ${modalClass}" 
  aria-label="Open Modal"
  title="Open Modal">Delete All</button>
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

// Checks
const textBox = $("#text");
$(".redo-form").hide();
textBox.on("input", () => {
  if (textBox.val()) {
    $(".redo-form").show();
  }
});

document.addEventListener("tasks-updated", () => {
  renderTasks();
  renderTaskHeader();
});
