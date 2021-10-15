let snackBarElement = document.querySelector(".snackbar");

const ToDo = {
  //DATA MEMBERS
  tasks: [],
  isEdited: false,

  //METHODS
  update(index, path, value) {
    return {
      ...this.tasks[index],
      [path]: value,
    };
  },

  addTask(tasks) {
    this.tasks.unshift(tasks);
    const textBox = document.querySelector("#text");
    textBox.focus();
    this.updateUI();
    setLS("tasks", this.tasks);
  },

  deleteTask(index) {
    this.tasks.splice(index, 1);
    snackBarElement.innerHTML = "A task has been deleted";
    toggleSnackBar();
    this.updateUI();
    setLS("tasks", this.tasks);
  },
  deleteAllTasks() {
    this.tasks = [];
    closeModal();
    snackBarElement.innerHTML = "All tasks have been deleted";
    toggleSnackBar();
    this.updateUI();
    setLS("tasks", this.tasks);
  },
  editTask(index) {
    let textDiv = document.querySelectorAll(`.text`)[index];
    const divTask = document.querySelectorAll(`.task`)[index];
    if (this.isEdited) {
      textDiv.removeAttribute("contenteditable");
      this.tasks[index] = this.update(index, "text", textDiv.textContent);
      divTask.classList.remove("edited");
      snackBarElement.innerHTML = "Task successfully edited";
      toggleSnackBar();
      setLS("tasks", this.tasks);
    } else {
      textDiv.setAttribute("contenteditable", true);
      textDiv.focus();
      divTask.classList.add("edited");
      setEndOfContenteditable(textDiv);
    }
    this.isEdited = !this.isEdited;
  },

  toggleTask(index) {
    const divTask = document.querySelectorAll(`.task`)[index];
    const { completed } = this.tasks[index];
    if (!completed) {
      divTask.classList.add("completed");
      snackBarElement.innerHTML = "Task is now completed ✔";
      toggleSnackBar();
    } else {
      divTask.classList.remove("completed");
    }
    this.tasks[index] = this.update(index, "completed", !completed);
    setLS("tasks", this.tasks);
  },

  updateUI() {
    document.dispatchEvent(new CustomEvent("tasks-updated"));
  },
  resetForm() {
    const form = document.querySelector("#new-task-form");
    $(".redo-form").hide();
    form.reset();
  },
};
const form = document.querySelector("#new-task-form");
form.addEventListener("submit", (e) => {
  let textBox = document.querySelector("#text").value;
  let dateBox = document.querySelector("#date").value;
  let timeBox = document.querySelector("#time").value;
  const formInputs = {
    textBox,
    dateBox,
    timeBox,
  };

  const date = new Date(dateBox + "," + timeBox).toLocaleString([], {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
  e.preventDefault();

  const isValidDate = Date.parse(formInputs.dateBox);
  if (isNaN(isValidDate)) {
    snackBarElement.innerHTML = "Date must have a valid format 📅";
    toggleSnackBar();
  }
  if (
    !formInputs.textBox.trim() ||
    !formInputs.dateBox ||
    !formInputs.timeBox
  ) {
    $(".redo-form").hide();
    snackBarElement.innerHTML = "All fields must have a value! 😟";
    toggleSnackBar();
    return;
  } else {
    $(".redo-form").show();
    ToDo.addTask({
      text: textBox,
      completed: false,
      date,
    });
    $(".task-wrapper:first-of-type").hide();
    $(".task-wrapper:first-of-type").fadeIn(800);
    form.reset();
    $(".redo-form").hide();
    snackBarElement.innerHTML = "A task has been added 👍";
    toggleSnackBar();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  if (getLS("tasks")) {
    ToDo.tasks = getLS("tasks");
    ToDo.updateUI();
  }
});
