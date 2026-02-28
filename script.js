const yearElement = document.getElementById("year");

if (yearElement) {
	yearElement.textContent = new Date().getFullYear();
}

const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector(".main-nav");

if (navToggle && mainNav) {
	const closeNav = () => {
		mainNav.classList.remove("is-open");
		navToggle.setAttribute("aria-expanded", "false");
	};

	navToggle.addEventListener("click", () => {
		const isOpen = mainNav.classList.toggle("is-open");
		navToggle.setAttribute("aria-expanded", String(isOpen));
	});

	mainNav.querySelectorAll("a").forEach((link) => {
		link.addEventListener("click", () => {
			closeNav();
		});
	});

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape") {
			closeNav();
		}
	});

	document.addEventListener("click", (event) => {
		if (!mainNav.classList.contains("is-open")) {
			return;
		}

		if (mainNav.contains(event.target) || navToggle.contains(event.target)) {
			return;
		}

		closeNav();
	});

	window.addEventListener("resize", () => {
		if (window.innerWidth > 640) {
			closeNav();
		}
	});
}

const consultationForm = document.getElementById("consultation-form");
const formStatus = document.getElementById("form-status");

if (consultationForm && formStatus) {
	consultationForm.addEventListener("invalid", () => {
		formStatus.textContent = "Please complete all required fields correctly before submitting.";
	}, true);

	consultationForm.addEventListener("input", () => {
		if (formStatus.textContent) {
			formStatus.textContent = "";
		}
	});

	consultationForm.addEventListener("submit", (event) => {
		event.preventDefault();
		formStatus.textContent =
			"Thank you. Your consultation request has been received. We will contact you shortly.";
		consultationForm.reset();
	});
}

const faqItems = document.querySelectorAll(".faq-list details");

faqItems.forEach((item) => {
	item.addEventListener("toggle", () => {
		if (!item.open) {
			return;
		}

		faqItems.forEach((otherItem) => {
			if (otherItem !== item) {
				otherItem.open = false;
			}
		});
	});
});
