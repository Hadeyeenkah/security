const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const STORAGE_KEY = "sentinelSecuritySubmissions";
const AUTH_KEY = "sentinelSecurityAdminAuth";
const ADMIN_USER = "Admin";
const ADMIN_PASS = "Aa123123Aa$";
const listElement = document.getElementById("submission-list");
const emptyState = document.getElementById("admin-empty");
const countElement = document.getElementById("submission-count");
const clearButton = document.getElementById("clear-submissions");
const exportButton = document.getElementById("export-json");
const logoutButton = document.getElementById("logout");
const loginSection = document.getElementById("admin-login");
const adminContent = document.getElementById("admin-content");
const loginForm = document.getElementById("login-form");
const loginStatus = document.getElementById("login-status");

const loadSubmissions = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return [];
  }

  try {
    return JSON.parse(stored);
  } catch (error) {
    return [];
  }
};

const saveSubmissions = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const isAuthenticated = () => localStorage.getItem(AUTH_KEY) === "true";

const setAuthenticated = (value) => {
  localStorage.setItem(AUTH_KEY, value ? "true" : "false");
};

const updateAuthUI = () => {
  const authed = isAuthenticated();
  if (loginSection) {
    loginSection.style.display = authed ? "none" : "block";
  }
  if (adminContent) {
    adminContent.style.display = authed ? "block" : "none";
  }
};

const formatDate = (isoString) => {
  if (!isoString) {
    return "";
  }

  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return isoString;
  }

  return date.toLocaleString();
};

const renderSubmissions = () => {
  if (!isAuthenticated()) {
    return;
  }
  const submissions = loadSubmissions();
  listElement.innerHTML = "";
  countElement.textContent = submissions.length;

  if (submissions.length === 0) {
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";

  submissions.slice().reverse().forEach((submission) => {
    const card = document.createElement("article");
    card.className = "submission-card";

    const header = document.createElement("div");
    header.className = "submission-header";

    const title = document.createElement("h3");
    title.textContent = submission.fullName || "Unnamed requester";

    const meta = document.createElement("div");
    meta.className = "submission-meta";
    meta.textContent = formatDate(submission.submittedAt);

    header.appendChild(title);
    header.appendChild(meta);

    const details = document.createElement("div");
    details.className = "submission-details";

    const detailItems = [
      { label: "Email", value: submission.email },
      { label: "Phone", value: submission.phone },
      { label: "Security Type", value: submission.securityTypeLabel || submission.securityType }
    ];

    detailItems.forEach((item) => {
      if (!item.value) {
        return;
      }

      const row = document.createElement("div");
      row.innerHTML = `<span>${item.label}:</span> ${item.value}`;
      details.appendChild(row);
    });

    if (submission.details && submission.details.length) {
      submission.details.forEach((detail) => {
        if (!detail.value) {
          return;
        }

        const row = document.createElement("div");
        row.innerHTML = `<span>${detail.label}:</span> ${detail.value}`;
        details.appendChild(row);
      });
    }

    card.appendChild(header);
    card.appendChild(details);
    listElement.appendChild(card);
  });
};

updateAuthUI();

if (clearButton) {
  clearButton.addEventListener("click", () => {
    if (!isAuthenticated()) {
      return;
    }
    const confirmed = window.confirm("Clear all submissions? This cannot be undone.");
    if (!confirmed) {
      return;
    }

    saveSubmissions([]);
    renderSubmissions();
  });
}

if (exportButton) {
  exportButton.addEventListener("click", () => {
    if (!isAuthenticated()) {
      return;
    }
    const submissions = loadSubmissions();
    const blob = new Blob([JSON.stringify(submissions, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "consultation-submissions.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  });
}

if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    setAuthenticated(false);
    updateAuthUI();
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const username = loginForm.username ? loginForm.username.value.trim() : "";
    const password = loginForm.password ? loginForm.password.value : "";

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setAuthenticated(true);
      updateAuthUI();
      renderSubmissions();
      loginForm.reset();
      if (loginStatus) {
        loginStatus.textContent = "";
      }
      return;
    }

    if (loginStatus) {
      loginStatus.textContent = "Invalid username or password.";
    }
  });
}
renderSubmissions();
