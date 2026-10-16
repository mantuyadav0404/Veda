"use strict";

/* ---------- DOM selection ---------- */
const form       = document.getElementById("task-form");
const input      = document.getElementById("task-input");
const errorEl    = document.getElementById("form-error");
const listEl     = document.getElementById("task-list");
const emptyEl    = document.getElementById("empty");
const countEl    = document.getElementById("count");
const clearBtn   = document.getElementById("clear-done");
const statusEl   = document.getElementById("status");

/* ---------- State: the single source of truth ----------
   The array holds the data. The page is only a picture of it.
   Each task gets a unique id, so removing one never confuses the others
   (array positions change after a removal, ids do not). */
let tasks = [];
let nextId = 1;
let newestId = null;     /* id of the task just added, used for the entrance animation */

/* ---------- Rendering ---------- */
/* Rebuild the whole list from the array after every change */
function render() {
  listEl.replaceChildren();                       /* clear the old list */

  tasks.forEach(function (task) {
    const li = document.createElement("li");
    li.className = "task" + (task.done ? " done" : "") + (task.id === newestId ? " new" : "");
    li.dataset.id = task.id;

    const label = document.createElement("label");
    label.className = "task-label";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "check";
    checkbox.checked = task.done;

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;                 /* textContent, not innerHTML: user text can never run as code */

    label.append(checkbox, text);

    const del = document.createElement("button");
    del.type = "button";
    del.className = "delete";
    del.textContent = "Delete";
    del.setAttribute("aria-label", "Delete task: " + task.text);

    li.append(label, del);
    listEl.appendChild(li);
  });

  newestId = null;
  updateSummary();
}

function updateSummary() {
  const remaining = tasks.filter(function (t) { return !t.done; }).length;
  const completed = tasks.length - remaining;

  emptyEl.hidden = tasks.length > 0;
  clearBtn.disabled = completed === 0;

  if (tasks.length === 0)      countEl.textContent = "0 tasks";
  else if (remaining === 0)    countEl.textContent = "All done!";
  else                         countEl.textContent = remaining + (remaining === 1 ? " task left" : " tasks left");
}

function announce(message) {
  statusEl.textContent = message;                 /* read aloud by screen readers */
}

function setError(message) {
  errorEl.textContent = message || "";
  input.setAttribute("aria-invalid", message ? "true" : "false");
}

/* ---------- Array operations ---------- */
function addTask(text) {
  const task = { id: nextId++, text: text, done: false };
  tasks.push(task);
  newestId = task.id;
}

function removeTask(id) {
  /* filter() returns a NEW array without the matching task */
  tasks = tasks.filter(function (task) { return task.id !== id; });
}

function toggleTask(id) {
  const task = tasks.find(function (t) { return t.id === id; });
  if (task) task.done = !task.done;
}

function clearCompleted() {
  tasks = tasks.filter(function (task) { return !task.done; });
}

/* ---------- Events ---------- */
/* Add a task (Enter key or the button, both submit the form) */
form.addEventListener("submit", function (event) {
  event.preventDefault();
  const text = input.value.trim();

  if (text === "") {
    setError("Please type a task first.");
    input.focus();
    return;
  }
  const duplicate = tasks.some(function (t) { return t.text.toLowerCase() === text.toLowerCase(); });
  if (duplicate) {
    setError("That task is already on your list.");
    input.focus();
    return;
  }

  setError("");
  addTask(text);
  input.value = "";
  render();
  announce("Task added: " + text);
  input.focus();
});

input.addEventListener("input", function () { setError(""); });

/* EVENT DELEGATION: one listener on the <ul> serves every task, including
   tasks added later. We find which task was clicked with closest(). */
listEl.addEventListener("click", function (event) {
  const button = event.target.closest(".delete");
  if (!button) return;

  const li = button.closest(".task");
  const id = Number(li.dataset.id);
  const index = tasks.findIndex(function (t) { return t.id === id; });
  const removed = tasks[index];

  removeTask(id);
  render();
  announce("Task removed: " + removed.text);

  /* Keep keyboard focus useful: move to the next task's Delete button, or back to the input */
  const next = listEl.children[Math.min(index, listEl.children.length - 1)];
  (next ? next.querySelector(".delete") : input).focus();
});

listEl.addEventListener("change", function (event) {
  if (!event.target.matches(".check")) return;

  const id = Number(event.target.closest(".task").dataset.id);
  toggleTask(id);
  render();

  /* The list was rebuilt, so put focus back on the same checkbox */
  const again = listEl.querySelector('.task[data-id="' + id + '"] .check');
  if (again) again.focus();
});

clearBtn.addEventListener("click", function () {
  clearCompleted();
  render();
  announce("Completed tasks cleared");
  input.focus();
});

/* ---------- Start ---------- */
render();
