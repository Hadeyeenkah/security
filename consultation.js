const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const form = document.getElementById("security-intake");
const typeSelect = document.getElementById("securityType");
const dynamicFields = document.getElementById("dynamic-fields");
const statusMessage = document.getElementById("intake-status");
const typeSummary = document.getElementById("type-summary");
const STORAGE_KEY = "halyardSecuritySubmissions";

const fieldTemplates = {
  executive: {
    summary: "Ideal for executive travel, close protection, or VIP movement planning.",
    fields: [
      { id: "principal", label: "Who needs protection?", type: "text", required: true },
      { id: "locations", label: "Primary locations or cities", type: "text", required: true },
      { id: "timeline", label: "Timeline and duration", type: "text", required: true },
      { id: "notes", label: "Specific risks or concerns", type: "textarea" }
    ]
  },
  residential: {
    summary: "Home, family, and personal security planning tailored to daily routines.",
    fields: [
      { id: "residence", label: "Residence location", type: "text", required: true },
      { id: "coverage", label: "Coverage scope (home, school routes, travel)", type: "text", required: true },
      { id: "household", label: "Number of household members", type: "number" },
      { id: "notes", label: "Specific threats or incidents", type: "textarea" }
    ]
  },
  corporate: {
    summary: "Security programs for offices, campuses, warehouses, or enterprise operations.",
    fields: [
      { id: "company", label: "Organization name", type: "text", required: true },
      { id: "siteCount", label: "Number of sites or facilities", type: "number", required: true },
      { id: "risk", label: "Key security risks", type: "textarea", required: true },
      { id: "timeline", label: "Desired start date", type: "text" }
    ]
  },
  event: {
    summary: "Security planning for corporate events, conferences, or private functions.",
    fields: [
      { id: "eventType", label: "Event type", type: "text", required: true },
      { id: "attendance", label: "Estimated attendance", type: "number", required: true },
      { id: "venue", label: "Venue and location", type: "text", required: true },
      { id: "notes", label: "Special considerations", type: "textarea" }
    ]
  },
  cyber: {
    summary: "Support for fraud recovery, cyber incidents, or scam response guidance.",
    fields: [
      { id: "incident", label: "Incident type", type: "text", required: true },
      { id: "impact", label: "Estimated impact or loss", type: "text" },
      { id: "timeline", label: "When did this occur?", type: "text", required: true },
      { id: "notes", label: "Key details or accounts involved", type: "textarea" }
    ]
  }
};

const renderFields = (type) => {
  dynamicFields.innerHTML = "";
  typeSummary.textContent = "";

  if (!type || !fieldTemplates[type]) {
    return;
  }

  const { summary, fields } = fieldTemplates[type];
  typeSummary.textContent = summary;

  fields.forEach((field) => {
    const label = document.createElement("label");
    label.setAttribute("for", field.id);
    label.textContent = field.label;

    let input;
    if (field.type === "textarea") {
      input = document.createElement("textarea");
      input.rows = 4;
    } else {
      input = document.createElement("input");
      input.type = field.type || "text";
    }

    input.id = field.id;
    input.name = field.id;
    if (field.required) {
      input.required = true;
    }

    dynamicFields.appendChild(label);
    dynamicFields.appendChild(input);
  });
};

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

const saveSubmission = (submission) => {
  const submissions = loadSubmissions();
  submissions.push(submission);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
};

if (typeSelect) {
  typeSelect.addEventListener("change", (event) => {
    renderFields(event.target.value);
    statusMessage.textContent = "";
  });
}

if (form && statusMessage) {
  form.addEventListener("invalid", () => {
    statusMessage.textContent = "Please complete all required fields for your security type.";
  }, true);

  form.addEventListener("input", () => {
    if (statusMessage.textContent) {
      statusMessage.textContent = "";
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const selectedType = typeSelect ? typeSelect.value : "";
    const template = fieldTemplates[selectedType];
    const details = [];

    if (template) {
      template.fields.forEach((field) => {
        const input = document.getElementById(field.id);
        const value = input ? input.value.trim() : "";
        details.push({ label: field.label, value });
      });
    }

    const submission = {
      submittedAt: new Date().toISOString(),
      fullName: form.fullName ? form.fullName.value.trim() : "",
      email: form.email ? form.email.value.trim() : "",
      phone: form.phone ? form.phone.value.trim() : "",
      securityType: selectedType,
      securityTypeLabel: typeSelect && typeSelect.selectedOptions.length
        ? typeSelect.selectedOptions[0].textContent
        : "",
      details
    };

    saveSubmission(submission);

    statusMessage.textContent =
      "Thank you. Your consultation request has been received. Our team will reach out shortly.";
    form.reset();
    renderFields("");
  });
}
