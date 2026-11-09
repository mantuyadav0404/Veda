const STORAGE_KEY = "spendwise_expenses_v1";
const CURRENCY = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" });
const $ = (selector) => document.querySelector(selector);

let expenses = loadExpenses();
const dialog = $("#expense-dialog");
const form = $("#expense-form");

function loadExpenses() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    console.warn("Could not read saved expenses:", error);
    return [];
  }
}

function saveExpenses() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch (error) {
    showToast("Unable to save. Check browser storage settings.");
  }
}

function formatMoney(value) {
  return CURRENCY.format(Number(value) || 0);
}

function formatDate(value) {
  if (!value) return "—";
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric"
  });
}

function categorySymbol(category) {
  const symbols = {
    Food: "☕", Transport: "↗", Shopping: "◇", Bills: "▤",
    Entertainment: "♫", Health: "＋", Education: "▣", Other: "•"
  };
  return symbols[category] || "•";
}

function render() {
  renderSummary();
  renderExpenses();
}

function renderSummary() {
  const total = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const now = new Date();
  const monthTotal = expenses
    .filter(item => {
      const [year, month] = item.date.split("-").map(Number);
      return year === now.getFullYear() && month === now.getMonth() + 1;
    })
    .reduce((sum, item) => sum + Number(item.amount), 0);

  $("#total-expenses").textContent = formatMoney(total);
  $("#month-expenses").textContent = formatMoney(monthTotal);
  $("#transaction-count").textContent = expenses.length;
  $("#month-label").textContent = now.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

function getFilteredExpenses() {
  const query = $("#search-input").value.trim().toLowerCase();
  const category = $("#category-filter").value;
  const dateFilter = $("#date-filter").value;
  const sort = $("#sort-filter").value;
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  let filtered = expenses.filter(item => {
    const matchesQuery = item.title.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query);
    const matchesCategory = category === "all" || item.category === category;
    const itemDate = new Date(`${item.date}T00:00:00`);
    let matchesDate = true;

    if (dateFilter === "month") {
      matchesDate = itemDate.getFullYear() === today.getFullYear() &&
        itemDate.getMonth() === today.getMonth();
    } else if (dateFilter === "week") {
      const daysAgo = new Date(startOfToday);
      daysAgo.setDate(daysAgo.getDate() - 6);
      matchesDate = itemDate >= daysAgo && itemDate <= startOfToday;
    }
    return matchesQuery && matchesCategory && matchesDate;
  });

  filtered.sort((a, b) => {
    if (sort === "oldest") return a.date.localeCompare(b.date) || a.createdAt - b.createdAt;
    if (sort === "high") return Number(b.amount) - Number(a.amount);
    if (sort === "low") return Number(a.amount) - Number(b.amount);
    return b.date.localeCompare(a.date) || b.createdAt - a.createdAt;
  });
  return filtered;
}

function renderExpenses() {
  const list = $("#expense-list");
  const filtered = getFilteredExpenses();
  list.innerHTML = "";

  filtered.forEach(item => {
    const row = document.createElement("tr");

    const descriptionCell = document.createElement("td");
    const description = document.createElement("div");
    description.className = "expense-name";
    const icon = document.createElement("span");
    icon.className = "category-icon";
    icon.textContent = categorySymbol(item.category);
    const title = document.createElement("span");
    title.textContent = item.title;
    description.append(icon, title);
    descriptionCell.append(description);

    const categoryCell = document.createElement("td");
    const pill = document.createElement("span");
    pill.className = "category-pill";
    pill.textContent = item.category;
    categoryCell.append(pill);

    const dateCell = document.createElement("td");
    dateCell.textContent = formatDate(item.date);

    const amountCell = document.createElement("td");
    amountCell.className = "amount";
    amountCell.textContent = formatMoney(item.amount);

    const actionsCell = document.createElement("td");
    const actions = document.createElement("div");
    actions.className = "actions";
    const editButton = document.createElement("button");
    editButton.className = "action-btn";
    editButton.type = "button";
    editButton.textContent = "Edit";
    editButton.setAttribute("aria-label", `Edit ${item.title}`);
    editButton.addEventListener("click", () => openEditDialog(item.id));
    const deleteButton = document.createElement("button");
    deleteButton.className = "action-btn";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete ${item.title}`);
    deleteButton.addEventListener("click", () => deleteExpense(item.id));
    actions.append(editButton, deleteButton);
    actionsCell.append(actions);

    row.append(descriptionCell, categoryCell, dateCell, amountCell, actionsCell);
    list.append(row);
  });

  const empty = filtered.length === 0;
  $("#empty-state").classList.toggle("visible", empty);
  $("#result-count").textContent = `Showing ${filtered.length} of ${expenses.length} transaction${expenses.length === 1 ? "" : "s"}`;
}

function openAddDialog() {
  form.reset();
  $("#expense-id").value = "";
  $("#dialog-title").textContent = "Add expense";
  $("#save-expense").textContent = "Save expense";
  $("#expense-date").value = new Date().toLocaleDateString("en-CA");
  $("#form-message").textContent = "";
  dialog.showModal();
  $("#expense-title").focus();
}

function openEditDialog(id) {
  const item = expenses.find(expense => expense.id === id);
  if (!item) return;
  $("#expense-id").value = item.id;
  $("#expense-title").value = item.title;
  $("#expense-amount").value = item.amount;
  $("#expense-category").value = item.category;
  $("#expense-date").value = item.date;
  $("#dialog-title").textContent = "Edit expense";
  $("#save-expense").textContent = "Update expense";
  $("#form-message").textContent = "";
  dialog.showModal();
  $("#expense-title").focus();
}

function deleteExpense(id) {
  const item = expenses.find(expense => expense.id === id);
  if (!item) return;
  if (!window.confirm(`Delete "${item.title}"? This action cannot be undone.`)) return;
  expenses = expenses.filter(expense => expense.id !== id);
  saveExpenses();
  render();
  showToast("Expense deleted.");
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("show"), 2400);
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const id = $("#expense-id").value;
  const title = $("#expense-title").value.trim();
  const amount = Number($("#expense-amount").value);
  const category = $("#expense-category").value;
  const date = $("#expense-date").value;

  if (!title || !Number.isFinite(amount) || amount <= 0 || !category || !date) {
    $("#form-message").textContent = "Please enter a valid name, amount, category and date.";
    return;
  }
  if (date > new Date().toLocaleDateString("en-CA")) {
    $("#form-message").textContent = "Please select today or an earlier date.";
    return;
  }

  if (id) {
    expenses = expenses.map(item => item.id === id
      ? { ...item, title, amount, category, date }
      : item);
    showToast("Expense updated successfully.");
  } else {
    expenses.push({
      id: (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
      title, amount, category, date, createdAt: Date.now()
    });
    showToast("Expense added successfully.");
  }

  saveExpenses();
  dialog.close();
  render();
});

["search-input", "category-filter", "date-filter", "sort-filter"].forEach(selector => {
  const element = document.getElementById(selector);
  element.addEventListener(selector === "search-input" ? "input" : "change", renderExpenses);
});

["open-add-top", "open-add-list", "empty-add"].forEach(id => {
  document.getElementById(id).addEventListener("click", openAddDialog);
});
$("#close-dialog").addEventListener("click", () => dialog.close());
$("#cancel-dialog").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => {
  if (event.target === dialog) dialog.close();
});

render();
