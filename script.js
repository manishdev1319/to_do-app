let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const text = document.getElementById("task-input").value.trim();
  const date = document.getElementById("due-date").value;
  const priority = document.getElementById("priority").value;

  if (!text) return;

  const task = {
    id: Date.now(),
    text,
    date,
    priority,
    completed: false
  };

  tasks.push(task);
  saveTasks();
  document.getElementById("task-input").value = "";
  document.getElementById("due-date").value = "";
  renderTasks();
}

function renderTasks(filter = "all") {
  const list = document.getElementById("task-list");
  list.innerHTML = "";

  let filtered = tasks;
  if (filter === "completed") filtered = tasks.filter(t => t.completed);
  if (filter === "pending") filtered = tasks.filter(t => !t.completed);

  filtered.forEach(task => {
    const li = document.createElement("li");
    li.classList.add(`priority-${task.priority}`);
    if (task.completed) li.classList.add("completed");

    const span = document.createElement("span");
    span.innerHTML = `<strong>${task.text}</strong>
      <div class="meta">
        ${task.date ? "Due: " + task.date : ""} (${task.priority})
      </div>`;
    span.onclick = () => toggleComplete(task.id);

    const delBtn = document.createElement("button");
    delBtn.textContent = "❌";
    delBtn.onclick = (e) => {
      e.stopPropagation();
      deleteTask(task.id);
    };

    li.appendChild(span);
    li.appendChild(delBtn);
    list.appendChild(li);
  });

  updateProgress();
}

function toggleComplete(id) {
  const task = tasks.find(t => t.id === id);
  if (task) task.completed = !task.completed;
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

function filterTasks(type) {
  renderTasks(type);
}

function clearAll() {
  if (confirm("Delete all tasks?")) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
}

function updateProgress() {
  const progress = document.getElementById("progress-info");
  const total = tasks.length;
  const done = tasks.filter(t => t.completed).length;
  progress.textContent = `✅ ${done} of ${total} tasks completed`;
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
}

document.getElementById("theme-toggle").addEventListener("change", toggleTheme);

// Load theme on start
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  document.getElementById("theme-toggle").checked = true;
}

// Initial load
renderTasks();
