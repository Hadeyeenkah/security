const yearElement = document.getElementById("year");
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const JOB_STORAGE_KEY = "halyardJobApplications";
const MAX_CV_FILE_BYTES = 2 * 1024 * 1024;
const form = document.getElementById("careers-form");
const statusMessage = document.getElementById("careers-status");
const cvInput = document.getElementById("careerCv");

const loadApplications = () => {
  const stored = localStorage.getItem(JOB_STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

const saveApplication = (application) => {
  const applications = loadApplications();
  applications.push(application);
  localStorage.setItem(JOB_STORAGE_KEY, JSON.stringify(applications));
};

const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = () => reject(new Error("Could not read CV file."));
  reader.readAsDataURL(file);
});

if (form && statusMessage) {
  form.addEventListener("invalid", () => {
    statusMessage.textContent = "Please complete all required fields before submitting.";
  }, true);

  form.addEventListener("input", () => {
    if (statusMessage.textContent) {
      statusMessage.textContent = "";
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const positionSelect = document.getElementById("careerPosition");
    const experienceSelect = document.getElementById("careerExperience");
    const cvFile = cvInput && cvInput.files && cvInput.files.length ? cvInput.files[0] : null;

    if (!cvFile) {
      statusMessage.style.color = "#b91c1c";
      statusMessage.textContent = "Please upload your CV before submitting.";
      return;
    }

    if (cvFile.size > MAX_CV_FILE_BYTES) {
      statusMessage.style.color = "#b91c1c";
      statusMessage.textContent = "CV file is too large. Please upload a file under 2MB.";
      return;
    }

    let cvDataUrl = "";
    try {
      cvDataUrl = await readFileAsDataUrl(cvFile);
    } catch (error) {
      statusMessage.style.color = "#b91c1c";
      statusMessage.textContent = "Could not process the uploaded CV. Please try again.";
      return;
    }

    const application = {
      type: "job-application",
      submittedAt: new Date().toISOString(),
      fullName: form.careerFullName ? form.careerFullName.value.trim() : "",
      email: form.careerEmail ? form.careerEmail.value.trim() : "",
      phone: form.careerPhone ? form.careerPhone.value.trim() : "",
      position: positionSelect ? positionSelect.value : "",
      positionLabel: positionSelect && positionSelect.selectedOptions.length
        ? positionSelect.selectedOptions[0].textContent
        : "",
      experience: experienceSelect ? experienceSelect.value : "",
      experienceLabel: experienceSelect && experienceSelect.selectedOptions.length
        ? experienceSelect.selectedOptions[0].textContent
        : "",
      location: form.careerLocation ? form.careerLocation.value.trim() : "",
      linkedin: form.careerLinkedin ? form.careerLinkedin.value.trim() : "",
      cvFileName: cvFile.name,
      cvFileType: cvFile.type || "application/octet-stream",
      cvDataUrl,
      coverLetter: form.careerCover ? form.careerCover.value.trim() : ""
    };

    saveApplication(application);

    statusMessage.style.color = "var(--accent)";
    statusMessage.textContent =
      "Thank you for your application! Our HR team will review it and reach out to you within 3–5 business days.";
    form.reset();
  });
}

// Mobile nav toggle (mirrors main site behaviour)
const navToggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("careers-nav");
if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("open");
  });
}
