// Keys in localStorage
const USER_KEY = "todoAppUser";
const TASKS_KEY_PREFIX = "todoAppTasks_"; // tasks stored per email

// DOM elements
const loginSection = document.getElementById("login-section");
const todoSection = document.getElementById("todo-section");

const loginForm = document.getElementById("login-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const loginError = document.getElementById("login-error");

const userNameSpan = document.getElementById("user-name");
const userEmailSpan = document.getElementById("user-email");
const logoutBtn = document.getElementById("logout-btn");

const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");

// State
let currentUser = null;
let tasks = [];

// Helpers for storage
function getTasksKey(email) {
  return TASKS_KEY_PREFIX + email;
}

function loadUserFromStorage() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveUserToStorage(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function loadTasksForUser(email) {
  const raw = localStorage.getItem(getTasksKey(email));
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveTasksForUser(email, tasks) {
  localStorage.setItem(getTasksKey(email), JSON.stringify(tasks));
}

function isValidGmail(email) {
  const basicPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
  return basicPattern.test(email) && email.toLowerCase().endsWith("@gmail.com"); 
}

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item";
    li.dataset.id = task.id;

    const leftDiv = document.createElement("div");
    leftDiv.className = "task-left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    const span = document.createElement("span");
    span.className = "task-text";
    if (task.completed) {
      span.classList.add("completed");
    }
    span.textContent = task.text;

    leftDiv.appendChild(checkbox);
    leftDiv.appendChild(span);

    const actionsDiv = document.createElement("div");
    actionsDiv.className = "task-actions";

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "btn btn-small";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "btn btn-small";

    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);

    li.appendChild(leftDiv);
    li.appendChild(actionsDiv);
    taskList.appendChild(li);

    checkbox.addEventListener("change", () => {
      toggleTaskCompleted(task.id, checkbox.checked);
    });

    editBtn.addEventListener("click", () => {
      editTask(task.id);
    });

    deleteBtn.addEventListener("click", () => {
      deleteTask(task.id);
    });
  });
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text || !currentUser) return;

  const newTask = {
    id: Date.now().toString(),
    text,
    completed: false,
  };

  tasks.push(newTask);
  saveTasksForUser(currentUser.email, tasks);
  renderTasks();
  taskInput.value = "";
}

function toggleTaskCompleted(id, completed) {
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return;
  tasks[idx].completed = completed;
  saveTasksForUser(currentUser.email, tasks);
  renderTasks();
}

function editTask(id) {
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return;

  const newText = prompt("Edit task:", tasks[idx].text);
  if (newText === null) return;
  const trimmed = newText.trim();
  if (!trimmed) return;

  tasks[idx].text = trimmed;
  saveTasksForUser(currentUser.email, tasks);
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasksForUser(currentUser.email, tasks);
  renderTasks();
}

function showLogin() {
  loginSection.classList.remove("hidden");
  todoSection.classList.add("hidden");
}

function showTodo() {
  loginSection.classList.add("hidden");
  todoSection.classList.remove("hidden");
}

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();

  if (!name || !email) {
    loginError.textContent = "Please fill all fields.";
    return;
  }

  if (!isValidGmail(email)) {
    loginError.textContent = "Email must be a valid address ending with @gmail.com.";
    return;
  }

  loginError.textContent = "";

  currentUser = { name, email };
  saveUserToStorage(currentUser);

  userNameSpan.textContent = name;
  userEmailSpan.textContent = email;

  tasks = loadTasksForUser(email);
  renderTasks();
  showTodo();
});

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});

logoutBtn.addEventListener("click", () => {
  currentUser = null;
  tasks = [];
  showLogin();
});

window.addEventListener("DOMContentLoaded", () => {
  const storedUser = loadUserFromStorage();
  if (storedUser && storedUser.email && isValidGmail(storedUser.email)) {
    currentUser = storedUser;
    userNameSpan.textContent = storedUser.name;
    userEmailSpan.textContent = storedUser.email;
    tasks = loadTasksForUser(storedUser.email);
    renderTasks();
    showTodo();
  } else {
    showLogin();
  }
});
