const ToDo = {
  //DATA MEMBERS
  tasks: [],

  //METHODS

  addTask(value) {
    this.tasks.push(value);
    document.dispatchEvent(new CustomEvent("task-added"));
    setLS("tasks", this.tasks);
  },
  deleteTask(index) {
    this.tasks.splice(index, 1);
    document.dispatchEvent(new CustomEvent("task-deleted"));
    setLS("tasks", this.tasks);
  },
  editTask(index) {
    let taskValue = document.querySelector(".text");
    taskValue.value = this.tasks[index];
    taskValue.removeAttribute("readonly");
    taskValue.focus();
    // document.dispatchEvent(new CustomEvent("task-edited"));
    // setLS("tasks", this.tasks);
  },
};
const form = document.querySelector("#new-task-form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let textBox = document.querySelector("#new-task-input");
  let textBoxValue = textBox.value;
  if (!textBoxValue) return;
  else {
    ToDo.addTask(textBoxValue);
    textBox.value = "";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  if (getLS("tasks")) {
    ToDo.tasks = getLS("tasks");
    document.dispatchEvent(new CustomEvent("task-created"));
  }
});
