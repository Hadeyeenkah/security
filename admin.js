const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const STORAGE_KEY = "halyardSecuritySubmissions";
const JOB_STORAGE_KEY = "halyardJobApplications";
const AUTH_KEY = "halyardSecurityAdminAuth";
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

// Job application elements
const jobsListElement = document.getElementById("jobs-list");
const jobsEmptyState = document.getElementById("jobs-empty");
const jobsCountElement = document.getElementById("jobs-count");
const jobsTabCountElement = document.getElementById("jobs-tab-count");
const consultTabCountElement = document.getElementById("consult-tab-count");
const clearJobsButton = document.getElementById("clear-jobs");
const exportJobsButton = document.getElementById("export-jobs-json");

// Tab elements
const tabConsultations = document.getElementById("tab-consultations");
const tabJobs = document.getElementById("tab-jobs");
const panelConsultations = document.getElementById("panel-consultations");
const panelJobs = document.getElementById("panel-jobs");

// ── Storage helpers ──────────────────────────────────────────────────────────

const loadSubmissions = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

const saveSubmissions = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const loadJobApplications = () => {
  const stored = localStorage.getItem(JOB_STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

const saveJobApplications = (items) => {
  localStorage.setItem(JOB_STORAGE_KEY, JSON.stringify(items));
};

// ── Auth helpers ─────────────────────────────────────────────────────────────

const isAuthenticated = () => localStorage.getItem(AUTH_KEY) === "true";

const setAuthenticated = (value) => {
  localStorage.setItem(AUTH_KEY, value ? "true" : "false");
};

const updateAuthUI = () => {
  const authed = isAuthenticated();
  if (loginSection) loginSection.style.display = authed ? "none" : "block";
  if (adminContent) adminContent.style.display = authed ? "block" : "none";
};

// ── Utilities ────────────────────────────────────────────────────────────────

const formatDate = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;
  return date.toLocaleString();
};

const escapeHtml = (str) => {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
};

// ── Tab switching ────────────────────────────────────────────────────────────

const switchTab = (activeTab) => {
  const isConsult = activeTab === "consultations";

  if (tabConsultations) {
    tabConsultations.classList.toggle("active", isConsult);
    tabConsultations.setAttribute("aria-selected", String(isConsult));
  }
  if (tabJobs) {
    tabJobs.classList.toggle("active", !isConsult);
    tabJobs.setAttribute("aria-selected", String(!isConsult));
  }
  if (panelConsultations) panelConsultations.hidden = !isConsult;
  if (panelJobs) panelJobs.hidden = isConsult;
};

if (tabConsultations) {
  tabConsultations.addEventListener("click", () => switchTab("consultations"));
}
if (tabJobs) {
  tabJobs.addEventListener("click", () => switchTab("jobs"));
}

// ── Render: Consultation submissions ────────────────────────────────────────

const renderSubmissions = () => {
  if (!isAuthenticated()) return;
  const submissions = loadSubmissions();

  if (listElement) listElement.innerHTML = "";
  if (countElement) countElement.textContent = submissions.length;
  if (consultTabCountElement) consultTabCountElement.textContent = submissions.length;

  if (submissions.length === 0) {
    if (emptyState) emptyState.style.display = "block";
    return;
  }

  if (emptyState) emptyState.style.display = "none";

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
      if (!item.value) return;
      const row = document.createElement("div");
      row.innerHTML = `<span>${escapeHtml(item.label)}:</span> ${escapeHtml(item.value)}`;
      details.appendChild(row);
    });

    if (submission.details && submission.details.length) {
      submission.details.forEach((detail) => {
        if (!detail.value) return;
        const row = document.createElement("div");
        row.innerHTML = `<span>${escapeHtml(detail.label)}:</span> ${escapeHtml(detail.value)}`;
        details.appendChild(row);
      });
    }

    card.appendChild(header);
    card.appendChild(details);
    if (listElement) listElement.appendChild(card);
  });
};

// ── Render: Job applications ─────────────────────────────────────────────────

const renderJobApplications = () => {
  if (!isAuthenticated()) return;
  const applications = loadJobApplications();

  if (jobsListElement) jobsListElement.innerHTML = "";
  if (jobsCountElement) jobsCountElement.textContent = applications.length;
  if (jobsTabCountElement) jobsTabCountElement.textContent = applications.length;

  if (applications.length === 0) {
    if (jobsEmptyState) jobsEmptyState.style.display = "block";
    return;
  }

  if (jobsEmptyState) jobsEmptyState.style.display = "none";

  applications.slice().reverse().forEach((app) => {
    const card = document.createElement("article");
    card.className = "submission-card job-card";

    const header = document.createElement("div");
    header.className = "submission-header";

    const title = document.createElement("h3");
    title.textContent = app.fullName || "Unknown applicant";

    const badge = document.createElement("span");
    badge.className = "job-badge";
    badge.textContent = app.positionLabel || app.position || "General Application";

    const meta = document.createElement("div");
    meta.className = "submission-meta";
    meta.textContent = formatDate(app.submittedAt);

    header.appendChild(title);
    header.appendChild(badge);
    header.appendChild(meta);

    const details = document.createElement("div");
    details.className = "submission-details";

    const detailItems = [
      { label: "Email", value: app.email },
      { label: "Phone", value: app.phone },
      { label: "Position", value: app.positionLabel || app.position },
      { label: "Experience", value: app.experienceLabel || app.experience },
      { label: "Location", value: app.location },
      { label: "LinkedIn / Portfolio", value: app.linkedin }
    ];

    detailItems.forEach((item) => {
      if (!item.value) return;
      const row = document.createElement("div");
      row.innerHTML = `<span>${escapeHtml(item.label)}:</span> ${escapeHtml(item.value)}`;
      details.appendChild(row);
    });

    if (app.cvFileName) {
      const cvRow = document.createElement("div");
      const cvLabel = document.createElement("span");
      cvLabel.textContent = "CV:";
      cvRow.appendChild(cvLabel);
      cvRow.append(" ");
      if (app.cvDataUrl) {
        const cvLink = document.createElement("a");
        cvLink.href = app.cvDataUrl;
        cvLink.download = app.cvFileName;
        cvLink.textContent = app.cvFileName;
        cvRow.appendChild(cvLink);
      } else {
        cvRow.append(document.createTextNode(app.cvFileName));
      }
      details.appendChild(cvRow);
    }

    if (app.coverLetter) {
      const coverRow = document.createElement("div");
      coverRow.className = "cover-letter-row";
      coverRow.innerHTML = `<span>Cover Letter:</span><p class="cover-letter-text">${escapeHtml(app.coverLetter)}</p>`;
      details.appendChild(coverRow);
    }

    card.appendChild(header);
    card.appendChild(details);
    if (jobsListElement) jobsListElement.appendChild(card);
  });
};

// ── Render all (called after login) ─────────────────────────────────────────

const renderAll = () => {
  renderSubmissions();
  renderJobApplications();
};

// ── Event listeners ──────────────────────────────────────────────────────────

updateAuthUI();

if (clearButton) {
  clearButton.addEventListener("click", () => {
    if (!isAuthenticated()) return;
    if (!window.confirm("Clear all consultation submissions? This cannot be undone.")) return;
    saveSubmissions([]);
    renderSubmissions();
  });
}

if (clearJobsButton) {
  clearJobsButton.addEventListener("click", () => {
    if (!isAuthenticated()) return;
    if (!window.confirm("Clear all job applications? This cannot be undone.")) return;
    saveJobApplications([]);
    renderJobApplications();
  });
}

if (exportButton) {
  exportButton.addEventListener("click", () => {
    if (!isAuthenticated()) return;
    const submissions = loadSubmissions();
    const blob = new Blob([JSON.stringify(submissions, null, 2)], { type: "application/json" });
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

if (exportJobsButton) {
  exportJobsButton.addEventListener("click", () => {
    if (!isAuthenticated()) return;
    const applications = loadJobApplications();
    const blob = new Blob([JSON.stringify(applications, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "job-applications.json";
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
      renderAll();
      loginForm.reset();
      if (loginStatus) loginStatus.textContent = "";
      return;
    }

    if (loginStatus) loginStatus.textContent = "Invalid username or password.";
  });
}

renderAll();

