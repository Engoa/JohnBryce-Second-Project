const FUSE_OPTIONS = {
  isCaseSensitive: false,
  includeMatches: true,
  threshold: 0.2,
  keys: ["text", "completed", "date", "time", "day"],
};

const ToDo = {
  //DATA MEMBERS
  tasks: [],
  isEdited: false,
  $fuse: null,

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
    if (!isMobile) {
      textBox.focus();
    } else {
      textBox.blur();
    }
    initializeDateAndTime(true);
    form.reset();
    this.syncLSandUI();
  },

  deleteTask(index) {
    this.tasks.splice(index, 1);
    toggleSnackBar("A task has been deleted ❌");
    triggerSound("../assets/pop.mp3");
    this.syncLSandUI();
  },

  deleteAllTasks() {
    this.tasks = [];
    closeModal();
    toggleSnackBar("All tasks have been deleted ❌");
    this.syncLSandUI();
  },

  editTask(index) {
    let currentlyEditedTask = this.tasks[index];
    let textDiv = document.querySelectorAll(`.text`)[index];
    const divTask = document.querySelectorAll(`.task`)[index];

    if (this.isEdited) {
      // Check to see if new task text hasn't changed
      if (!textDiv.textContent.length) {
        toggleSnackBar("Task description cannot be empty!");
        $(".edited").addClass("shakeError");
        $(".shakeError").css("backgroundColor", "var(--task-error);");
        setTimeout(() => {
          // Remove class after anim is finished
          $(".edited").removeClass("shakeError");
        }, 550);
        this.isEdited = false;
      } else {
        // Check to see if new text is valid, *save and update new value*
        textDiv.removeAttribute("contenteditable");
        this.tasks[index] = this.update(index, "text", textDiv.textContent);
        divTask.classList.remove("edited");
        setLS("tasks", this.tasks);

        // Check to see if new task text is empty
        if (currentlyEditedTask.text.trim() !== textDiv.textContent.trim()) {
          toggleSnackBar("Task successfully edited");
        }
      }
    } else {
      textDiv.setAttribute("contenteditable", true);
      textDiv.focus();
      divTask.classList.add("edited");
      setEndOfContenteditable(textDiv);
    }
    this.isEdited = !this.isEdited;
  },

  toggleTask(index) {
    if (!this.isEdited) {
      const divTask = document.querySelectorAll(`.task`)[index];
      const { completed } = this.tasks[index];
      if (!completed) {
        divTask.classList.add("completed");
        toggleSnackBar("Task is now completed ✔");
        confettiLight();
      } else {
        divTask.classList.remove("completed");
      }
      this.tasks[index] = this.update(index, "completed", !completed);
      this.updateUICompleted();
    }
  },

  completeAllTasks() {
    this.tasks = this.tasks.map((item) => ({
      ...item,
      completed: true,
    }));
    toggleSnackBar("All tasks are now completed ✔");
    confettiStrong();
    this.syncLSandUI();
  },

  unCompleteAllTasks() {
    this.tasks = this.tasks.map((item) => ({
      ...item,
      completed: false,
    }));
    toggleSnackBar("All tasks are now uncompleted");
    this.syncLSandUI();
  },

  resetForm() {
    $(".redo-form").hide();
    initializeDateAndTime(true);
    form.reset();
  },

  updateUICompleted() {
    document.dispatchEvent(new CustomEvent("tasks-completed"));
    setLS("tasks", this.tasks);
  },

  syncLSandUI() {
    document.dispatchEvent(new CustomEvent("tasks-updated"));
    setLS("tasks", this.tasks);
  },
};
const form = document.querySelector("#new-task-form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let textBox = $("#text").val();
  let dateBox = $("#date").val();
  let timeBox = $("#time").val();
  const formInputs = {
    textBox,
    dateBox,
    timeBox,
  };

  if (
    !formInputs.textBox.trim() ||
    !formInputs.dateBox ||
    !formInputs.timeBox ||
    formInputs.textBox.trim().length <= 3
  ) {
    $(".redo-form").hide();
    toggleSnackBar("All fields must have a value, or a description of minimum 3 letters 😟");
    return;
  } else {
    $(".redo-form").show();
    ToDo.addTask({
      text: textBox,
      completed: false,
      date: dayjs(dateBox).format("MMMM-DD-YYYY"),
      day: dayjs(dateBox).format("dddd"),
      time: timeBox,
    });
    $(".task-wrapper:first-of-type").hide();
    $(".task-wrapper:first-of-type").fadeIn(800);
    form.reset();
    $(".redo-form").hide();
    toggleSnackBar("A task has been added 👍");
  }
});

document.addEventListener("tasks-updated", () => {
  ToDo.$fuse = new Fuse(ToDo.tasks, FUSE_OPTIONS);
});
document.addEventListener("DOMContentLoaded", () => {
  if (getLS("tasks")) {
    ToDo.tasks = getLS("tasks");
    ToDo.syncLSandUI();
  }
});
