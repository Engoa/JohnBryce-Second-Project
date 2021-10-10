// If width is mobile, change event to click instead of dblclick
const addToggleTaskListeners = () => {
  const task = document.querySelectorAll(".task");
  task.forEach((btn) => {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    btn.addEventListener(isMobile ? "click" : "dblclick", () => {
      ToDo.toggleTask(btn.dataset.id);
    });
  });
};
// Run on the tasks array, and render them
const renderTasks = () => {
  let tasksHtml = "";
  ToDo.tasks.forEach((task, index) => {
    const isCompletedClass = task.completed ? "completed" : "";
    const oddIndex = index % 2 !== 0 ? "task2" : "";
    tasksHtml += `
<div class="task-wrapper">
  <div class="task ${isCompletedClass} ${oddIndex}"  
    data-id="${index}">
      <div class="content">
  <div class="content-left">
    <button class="edit btn" data-id="${index}">
      <i class="fas fa-pencil-alt editbtn" title="Edit Task"></i>
      <i class="fas fa-save savebtn" title="Save Task"></i>
    </button>
  </div>
    <div class="content-right">
      <p class="text" spellcheck="false">${task.text}</p>
        <span class="time">${task.date}</span>
    </div>
  </div>
    <div class="task__status">
    <button class="delete btn" data-id="${index}" title='Delete Task' >
    <i class="fas fa-times"></i>
    </button>
    <i class="fas fa-check" title='Task Completed'></i>
    </div>
  </div>
</div>
        `;
  });

  $(".tasks").html(tasksHtml);

  // Event listeners for action buttons

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

// Render the header and modal btn
const renderTaskHeader = () => {
  const drawTaskHeader = document.querySelector(".task-list--header");
  const modalClass = ToDo.tasks.length <= 0 ? "hide-element" : ``;
  drawTaskHeader.innerHTML = `
  <h2 class="${modalClass}">Tasks</h2>
  <h6 class="${modalClass}">
    Double click on a task to complete ✔
   </h6>
  <button class="open-modal ${modalClass} btn-cta" 
  aria-label="Open Modal"
  title="Open Modal">Delete All</button>
  `;

  // Open Delete Modal
  $(".open-modal").click(() => openModal());
};

//Render if no tasks are available and check for it
const renderToAddFirstTask = () => {
  const drawAddFirstTask = $(".render-if-no-tasks");
  const hideIfTasksAvailable = ToDo.tasks.length > 0 ? "hide-element" : ``;
  drawAddFirstTask.html(`
      <div class="add-first-task ${hideIfTasksAvailable}">
      <i class="fas fa-tasks"></i>
      <p>Add your first task!</p>
      <span>😊</span>
      </div>
`);
};

renderToAddFirstTask();
// Close/Open Delete all tasks modal
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
  } else {
    $(".redo-form").hide();
  }
});

// Events to update UI
document.addEventListener("tasks-updated", () => {
  renderTasks();
  renderTaskHeader();
  renderToAddFirstTask();
});

// Date conversion
const dt = new Date();
const fullDate = {
  month: dt.getMonth() + 1,
  day: dt.getDate() - 1,
  year: dt.getFullYear(),
};
const { month, day, year } = fullDate;

$(document).ready(() => {
  $("#date").attr("min", `${year}-${month}-${day < 10 ? "0" + day : day}`);
  $("#date").attr(
    "max",
    `${year + 3}-${month + 2}-${day + 22 < 10 ? "0" + day : String(day + 22)}`
  );
});
