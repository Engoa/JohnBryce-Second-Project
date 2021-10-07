let snackBarElement = document.querySelector("#snackbar");

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
    this.tasks.push(tasks);
    const textBox = document.querySelector("#new-task-input");
    textBox.focus();
    this.updateUI();
    setLS("tasks", this.tasks);
  },
  deleteTask(index) {
    this.tasks.splice(index, 1);
    snackBarElement.innerHTML = "Task Deleted";
    toggleSnackBar();
    this.updateUI();
    setLS("tasks", this.tasks);
  },
  deleteAllTasks() {
    this.tasks = [];
    closeModal();
    snackBarElement.innerHTML = "All Tasks Deleted";
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
      snackBarElement.innerHTML = "Task Edited";
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
      snackBarElement.innerHTML = "Task Completed";
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
};
const form = document.querySelector("#new-task-form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let textBox = document.querySelector("#new-task-input");
  let textBoxValue = textBox.value;
  if (!textBoxValue) return;
  else {
    ToDo.addTask({
      text: textBoxValue,
      completed: false,
    });
    $(".task-wrapper:last-of-type").css("display", "none");
    $(".task-wrapper:last-of-type").fadeIn(350);
    textBox.value = "";
    snackBarElement.innerHTML = "Task Added";
    toggleSnackBar();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  if (getLS("tasks")) {
    ToDo.tasks = getLS("tasks");
    ToDo.updateUI();
  }
});
