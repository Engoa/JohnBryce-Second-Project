// If width is mobile, change event to click instead of dblclick
const addToggleTaskListeners = () => {
  const task = document.querySelectorAll(".task");
  task.forEach((btn) => {
    btn.addEventListener(isMobile ? "click" : "dblclick", () => {
      ToDo.toggleTask(btn.dataset.id);
    });
  });
};
// Run on the tasks array, and render them
const renderTasks = (searchResults) => {
  const tasks = searchResults?.length ? searchResults : ToDo.tasks;
  let tasksHtml = "";
  tasks.forEach((task, index) => {
    const isCompletedClass = task.completed ? "completed" : "";
    const oddIndex = index % 2 !== 0 ? "task-reversed" : "";
    tasksHtml += `
<div class="task-wrapper">
  <div class="task ${isCompletedClass} ${oddIndex}"  
    data-id="${index}">
    <div class="content"> 
  <div class="content-left">
    <button class="edit btn tippy" data-id="${index}" data-tippy-content="Save/Edit">
      <i class="fas fa-pencil-alt editbtn"></i>
      <i class="fas fa-save savebtn"></i>
    </button>
  </div>
    <div class="content-right">
      <p class="text" spellcheck="false">${task.text}</p>
        <span class="time">${task.date}</span>
    </div>
  </div>
    <div class="task__status">
    <button class="delete btn tippy" data-id="${index}" data-tippy-content="Delete">
    <i class="fas fa-times"></i>
    </button>
    <i class="fas fa-check tippy" data-tippy-content="Task Completed"></i>
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

  $(document).keydown((e) => {
    if (e.keyCode === 13 && ToDo.isEdited) {
      e.preventDefault();
    }
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
  const modalClass = !ToDo.tasks.length ? "hide-element" : ``;
  const drawTaskHeader = document.querySelector(".task-list--header");
  drawTaskHeader.innerHTML = `
  <h2 class="${modalClass}">Tasks</h2>
  <h6 class="${modalClass}">
    Double click on a task to complete ✔
   </h6>
   <div>
   <button class="open-modal ${modalClass} btn-cta" 
    aria-label="Open Modal">Delete All</button>
    </div>
  `;

  // Open Delete Modal
  $(".open-modal").click(() => openModal());

  // Tippies for Tooltips
  tippy(".tippy", {
    animation: "shift-toward",
    inertia: true,
    touch: true,
    duration: [400, 400],
    theme: "theme",
    arrow: true,
  });
};

const renderCompleteButtons = () => {
  const modalClass = !ToDo.tasks.length ? "hide-element" : ``;
  const hideIfAllCompleted = ToDo.tasks.every((item) => item.completed) ? "hide-element" : "";
  const hideIfSomeUnCompleted = ToDo.tasks.some((item) => !item.completed) ? "hide-element" : "";
  const renderButtons = document.querySelector(".render-buttons");
  renderButtons.innerHTML = `
    <div class="buttons-wrapper">
    <button class="complete-all ${modalClass} btn-cta ${hideIfAllCompleted}">Complete All</button>
    <button class="uncomplete-all ${modalClass} btn-cta ${hideIfSomeUnCompleted}" >Uncomplete All</button>
    </div>  
  `;

  // Event to complete all tasks
  const completeAll = document.querySelector(".complete-all");
  completeAll.addEventListener("click", () => ToDo.completeAllTasks());

  const unCompleteAll = document.querySelector(".uncomplete-all");
  unCompleteAll.addEventListener("click", () => ToDo.unCompleteAllTasks());
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

// If modal is open, pressing Enter will delete all tasks!
$(document).keydown((e) => {
  if (e.keyCode === 13 && isOpen) {
    ToDo.deleteAllTasks();
  }
});

const searchInput = $(".search-task");
searchInput.on("input", () => {
  const mappedResults = ToDo.$fuse.search(searchInput.val()).map(({ item }) => item);
  renderTasks(mappedResults);

  if (searchInput.val().length >= 7) {
    toggleSnackBar("Search field is too long - Showing all tasks");
  }
});

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
  renderCompleteButtons();
  if (!ToDo.tasks.length) {
    $(".task-search").hide();
  } else {
    $(".task-search").show();
  }
});
document.addEventListener("tasks-completed", () => {
  renderCompleteButtons();
});

// Date conversion
const initializeDateAndTime = (reset = false) => {
  const dateDates = {
    min: dayjs().add(-1, "day").format("YYYY-MM-DD"),
    max: dayjs().add(1, "year").format("YYYY-MM-DD"),
    value: reset ? null : dayjs().format("YYYY-MM-DD"),
  };
  const dateTimes = {
    value: reset ? null : dayjs().format("HH:mm"),
  };
  for (const key in dateDates) $("#date").attr(key, dateDates[key]);
  for (const key in dateTimes) $("#time").attr(key, dateTimes[key]);
};
initializeDateAndTime();

//Button between inputs to get current date/time
$(".current-date").click(() => initializeDateAndTime());

$(document).ready(() => {
  if ($(".task-wrapper")) {
    gsap.from(".task-wrapper", {
      y: 500,
      opacity: 0,
      filter: "blur(15px)",
      stagger: 0.15,
      duration: 1,
    });
  }
});
