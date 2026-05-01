const STORAGE_KEY = "todo-app-green-fresh";
const DEFAULT_CATEGORY = "tentative";

const CATEGORY_CONFIG = {
  urgent: { label: "\u7d27\u6025" },
  soon: { label: "\u7a0d\u7d27\u6025" },
  relaxed: { label: "\u4e0d\u7d27\u6025" },
  tentative: { label: "\u6682\u5b9a" }
};

const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const categorySelect = document.getElementById("category-select");
const categoryTabs = Array.from(document.querySelectorAll("[data-category-tab]"));
const todoList = document.getElementById("todo-list");
const emptyState = document.getElementById("empty-state");
const totalCount = document.getElementById("total-count");
const completedCount = document.getElementById("completed-count");
const pendingCount = document.getElementById("pending-count");
const currentCategoryTitle = document.getElementById("current-category-title");
const plannerModal = document.getElementById("planner-modal");
const plannerForm = document.getElementById("planner-form");
const plannerInput = document.getElementById("planner-input");
const plannerTaskText = document.getElementById("planner-task-text");
const plannerClose = document.getElementById("planner-close");
const plannerCancel = document.getElementById("planner-cancel");
const plannerClear = document.getElementById("planner-clear");

let todos = loadTodos();
let activeMenuId = null;
let moveMenuTodoId = null;
let planningTodoId = null;
let currentCategory = DEFAULT_CATEGORY;

renderApp();

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = todoInput.value.trim();
  if (!text) {
    todoInput.focus();
    return;
  }

  const category = normalizeCategory(categorySelect.value);

  todos.push({
    id: generateId(),
    text,
    category,
    completed: false,
    createdAt: Date.now(),
    completedAt: null,
    plannedAt: null
  });

  persistTodos();
  todoForm.reset();
  categorySelect.value = DEFAULT_CATEGORY;
  currentCategory = category;
  activeMenuId = null;
  moveMenuTodoId = null;
  renderApp();
  todoInput.focus();
});

categoryTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    currentCategory = normalizeCategory(tab.dataset.category);
    activeMenuId = null;
    moveMenuTodoId = null;
    renderApp();
  });
});

todoList.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-menu-trigger]");
  if (trigger) {
    event.stopPropagation();
    const { id } = trigger.dataset;
    activeMenuId = activeMenuId === id ? null : id;
    moveMenuTodoId = null;
    renderTodos();
    return;
  }

  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) {
    return;
  }

  event.stopPropagation();

  const { action, id } = actionButton.dataset;
  const todo = todos.find((item) => item.id === id);
  if (!todo) {
    return;
  }

  if (action === "toggle-complete") {
    toggleComplete(todo);
    return;
  }

  if (action === "show-move-options") {
    moveMenuTodoId = moveMenuTodoId === todo.id ? null : todo.id;
    renderTodos();
    return;
  }

  if (action === "move-to-category") {
    moveTodo(todo, actionButton.dataset.category);
    return;
  }

  if (action === "plan-time") {
    openPlanner(todo);
    return;
  }

  if (action === "delete") {
    deleteTodo(todo.id);
  }
});

plannerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const todo = todos.find((item) => item.id === planningTodoId);
  if (!todo) {
    closePlanner();
    return;
  }

  todo.plannedAt = plannerInput.value ? new Date(plannerInput.value).getTime() : null;
  persistTodos();
  closePlanner();
  renderApp();
});

plannerClose.addEventListener("click", closePlanner);
plannerCancel.addEventListener("click", closePlanner);

plannerClear.addEventListener("click", () => {
  plannerInput.value = "";
});

plannerModal.addEventListener("click", (event) => {
  if (event.target === plannerModal) {
    closePlanner();
  }
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".todo-menu-wrap")) {
    if (activeMenuId !== null) {
      activeMenuId = null;
      moveMenuTodoId = null;
      renderTodos();
    }
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (!plannerModal.classList.contains("hidden")) {
      closePlanner();
      return;
    }

    if (activeMenuId !== null) {
      activeMenuId = null;
      moveMenuTodoId = null;
      renderTodos();
    }
  }
});

function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map((todo) => ({
      ...todo,
      category: normalizeCategory(todo.category),
      plannedAt: todo.plannedAt ?? null,
      completedAt: todo.completedAt ?? null
    }));
  } catch (error) {
    console.error("\u8bfb\u53d6\u672c\u5730\u4efb\u52a1\u5931\u8d25:", error);
    return [];
  }
}

function persistTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function normalizeCategory(category) {
  return CATEGORY_CONFIG[category] ? category : DEFAULT_CATEGORY;
}

function generateId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `todo-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function toggleComplete(todo) {
  todo.completed = !todo.completed;
  todo.completedAt = todo.completed ? Date.now() : null;
  activeMenuId = null;
  moveMenuTodoId = null;
  persistTodos();
  renderApp();
}

function openPlanner(todo) {
  planningTodoId = todo.id;
  activeMenuId = null;
  moveMenuTodoId = null;
  plannerTaskText.textContent = `\u4e3a\u201c${todo.text}\u201d\u8bbe\u7f6e\u4f60\u8ba1\u5212\u5904\u7406\u7684\u65f6\u95f4\u3002`;
  plannerInput.value = todo.plannedAt ? toDateTimeLocalValue(todo.plannedAt) : "";
  plannerModal.classList.remove("hidden");
  plannerInput.focus();
  renderTodos();
}

function closePlanner() {
  planningTodoId = null;
  plannerModal.classList.add("hidden");
  plannerForm.reset();
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  activeMenuId = null;
  moveMenuTodoId = null;
  persistTodos();
  renderApp();
}

function moveTodo(todo, nextCategory) {
  const normalizedCategory = normalizeCategory(nextCategory);
  if (todo.category === normalizedCategory) {
    return;
  }

  todo.category = normalizedCategory;
  activeMenuId = null;
  moveMenuTodoId = null;
  persistTodos();
  renderApp();
}

function renderApp() {
  document.body.dataset.category = currentCategory;
  renderTabs();
  renderTodos();
}

function renderTabs() {
  categoryTabs.forEach((tab) => {
    const isActive = normalizeCategory(tab.dataset.category) === currentCategory;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-current", isActive ? "page" : "false");
  });

  currentCategoryTitle.textContent = `${CATEGORY_CONFIG[currentCategory].label}任务`;
}

function renderTodos() {
  const visibleTodos = getVisibleTodos();
  todoList.innerHTML = "";

  for (const todo of visibleTodos) {
    const item = document.createElement("li");
    item.className = `todo-item${todo.completed ? " completed" : ""}`;

    const content = document.createElement("div");
    content.className = "todo-content";

    const headline = document.createElement("div");
    headline.className = "todo-headline";

    const text = document.createElement("p");
    text.className = "todo-text";
    text.textContent = todo.text;

    const categoryBadge = document.createElement("span");
    categoryBadge.className = "todo-category";
    categoryBadge.dataset.category = todo.category;
    categoryBadge.textContent = CATEGORY_CONFIG[todo.category].label;

    const status = document.createElement("span");
    status.className = "todo-status";
    status.textContent = todo.completed
      ? "\u5df2\u5b8c\u6210"
      : "\u5f85\u5904\u7406";

    headline.append(text, categoryBadge);

    const metaGroup = document.createElement("div");
    metaGroup.className = "todo-meta-group";

    const metaRow = document.createElement("div");
    metaRow.className = "todo-meta-row";

    const meta = document.createElement("span");
    meta.className = "todo-meta";
    meta.textContent = todo.completed
      ? `\u5b8c\u6210\u4e8e ${formatTime(todo.completedAt)}`
      : `\u521b\u5efa\u4e8e ${formatTime(todo.createdAt)}`;

    metaRow.append(meta);

    if (todo.plannedAt) {
      const plan = document.createElement("span");
      plan.className = "todo-plan";
      plan.textContent = `\u8ba1\u5212\u65f6\u95f4 ${formatTime(todo.plannedAt)}`;
      metaRow.append(plan);
    }

    metaGroup.append(metaRow);
    content.append(headline, metaGroup);

    const itemAside = document.createElement("div");
    itemAside.className = "todo-item-aside";

    const badges = document.createElement("div");
    badges.className = "todo-badges-side";

    badges.append(status);

    if (todo.plannedAt && !todo.completed) {
      const urgency = document.createElement("span");
      const urgencyInfo = getUrgencyInfo(todo.plannedAt);
      urgency.className = `todo-urgency ${urgencyInfo.className}`;
      urgency.textContent = urgencyInfo.label;
      badges.append(urgency);
    }

    const menuWrap = document.createElement("div");
    menuWrap.className = "todo-menu-wrap";

    const trigger = document.createElement("button");
    trigger.className = "menu-trigger";
    trigger.type = "button";
    trigger.dataset.menuTrigger = "true";
    trigger.dataset.id = todo.id;
    trigger.setAttribute("aria-label", `\u6253\u5f00 ${todo.text} \u7684\u83dc\u5355`);
    trigger.setAttribute("aria-expanded", activeMenuId === todo.id ? "true" : "false");
    trigger.textContent = "...";

    const menu = document.createElement("div");
    menu.className = `todo-menu${activeMenuId === todo.id ? "" : " hidden"}`;

    const completeButton = buildMenuButton(
      todo.completed ? "\u53d6\u6d88\u5b8c\u6210" : "\u5b8c\u6210",
      "toggle-complete",
      todo.id
    );
    const moveButton = buildMenuButton("\u79fb\u52a8\u81f3", "show-move-options", todo.id);
    const planButton = buildMenuButton("\u8ba1\u5212\u65f6\u95f4", "plan-time", todo.id);
    const deleteButton = buildMenuButton("\u5220\u9664", "delete", todo.id, "menu-button-danger");

    menu.append(completeButton, moveButton);

    if (moveMenuTodoId === todo.id) {
      menu.append(buildMoveOptions(todo));
    }

    menu.append(planButton, deleteButton);
    menuWrap.append(trigger, menu);

    itemAside.append(badges, menuWrap);
    item.append(content, itemAside);
    todoList.append(item);
  }

  const completedTotal = todos.filter((todo) => todo.completed).length;
  const pendingTotal = todos.length - completedTotal;

  totalCount.textContent = String(todos.length);
  completedCount.textContent = String(completedTotal);
  pendingCount.textContent = String(pendingTotal);
  emptyState.textContent = `\u5f53\u524d\u5206\u7c7b\u6682\u65f6\u6ca1\u6709${CATEGORY_CONFIG[currentCategory].label}\u4e8b\u4ef6\uff0c\u5148\u6dfb\u52a0\u4e00\u6761\u5427\u3002`;
  emptyState.classList.toggle("hidden", visibleTodos.length > 0);
}

function getVisibleTodos() {
  return todos
    .filter((todo) => todo.category === currentCategory)
    .sort(sortTodos);
}

function buildMenuButton(label, action, id, extraClass = "") {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `menu-button${extraClass ? ` ${extraClass}` : ""}`;
  button.dataset.action = action;
  button.dataset.id = id;
  button.textContent = label;
  return button;
}

function buildMoveOptions(todo) {
  const movePanel = document.createElement("div");
  movePanel.className = "move-panel";

  Object.entries(CATEGORY_CONFIG)
    .filter(([category]) => category !== todo.category)
    .forEach(([category, config]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `move-option move-option-${category}`;
      button.dataset.action = "move-to-category";
      button.dataset.id = todo.id;
      button.dataset.category = category;
      button.textContent = config.label;
      movePanel.append(button);
    });

  return movePanel;
}

function sortTodos(a, b) {
  if (a.completed !== b.completed) {
    return a.completed ? 1 : -1;
  }

  if (a.completed && b.completed) {
    return (a.completedAt ?? 0) - (b.completedAt ?? 0);
  }

  const aHasPlan = Boolean(a.plannedAt);
  const bHasPlan = Boolean(b.plannedAt);

  if (aHasPlan && bHasPlan) {
    if (a.plannedAt !== b.plannedAt) {
      return a.plannedAt - b.plannedAt;
    }

    return a.createdAt - b.createdAt;
  }

  if (aHasPlan !== bHasPlan) {
    return aHasPlan ? -1 : 1;
  }

  return a.createdAt - b.createdAt;
}

function getUrgencyInfo(plannedAt) {
  const diff = plannedAt - Date.now();
  const hour = 60 * 60 * 1000;

  if (diff <= 0) {
    return {
      label: "\u5df2\u8fc7\u65f6",
      className: "is-overdue"
    };
  }

  if (diff <= 24 * hour) {
    return {
      label: "\u5373\u5c06\u5230\u65f6",
      className: "is-soon"
    };
  }

  return {
    label: "\u65f6\u95f4\u8fd8\u5145\u88d5",
    className: "is-calm"
  };
}

function formatTime(timestamp) {
  if (!timestamp) {
    return "";
  }

  return new Date(timestamp).toLocaleString("zh-CN", {
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function toDateTimeLocalValue(timestamp) {
  const date = new Date(timestamp);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
}
