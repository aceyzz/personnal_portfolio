class CertificationService {
	#jsonPath = "/data/certification.json";
	#certifications = [];

	async init(containerId) {
		try {
			this.#certifications = await this.#fetchCertifications();
			this.#render(containerId);
		} catch (error) {
			console.error("Error initializing CertificationService:", error);
			this.#renderError(containerId);
		}
	}

	async #fetchCertifications() {
		const response = await fetch(this.#jsonPath);
		if (!response.ok) {
			throw new Error(`Failed to fetch certification data from ${this.#jsonPath}`);
		}
		const data = await response.json();
		return data.certifications;
	}

	#render(containerId) {
		const container = document.getElementById(containerId);
		if (!container) {
			throw new Error(`Container with ID "${containerId}" not found.`);
		}
		container.innerHTML = "";

		const fragment = document.createDocumentFragment();
		this.#certifications
			.sort((a, b) => b.id - a.id)
			.forEach((certification) => {
				const certificationElement = this.#createCertificationElement(certification);
				fragment.appendChild(certificationElement);
			});
		container.appendChild(fragment);
	}

	#createCertificationElement(certification) {
		const certificationElement = document.createElement("div");
		certificationElement.className = "certification collapsed";
		certificationElement.innerHTML = `
			<h2 class="certification-toggle" style="margin: 0;">
				<img src="${certification.logo}" alt="${certification.title}" class="certification-logo" />
				${certification.title}
			</h2>
			<div class="certification-body">
				<div class="certification-header">
					<p class="certification-provider">Délivré par <strong>${certification.provider}</strong></p>
					<p class="certification-date">${certification.date}</p>
				</div>
				<div class="certification-details">
					<h4>Description</h4>
					<p>${certification.description}</p>
					<h4>Compétences acquises</h4>
					<div class="skills">
						${certification.skills.map((skill) => `<span class="skill">${skill}</span>`).join("")}
					</div>
				</div>
			</div>
		`;

		certificationElement.querySelector(".certification-toggle").addEventListener("click", () => {
			certificationElement.classList.toggle("collapsed");
			certificationElement.classList.toggle("expanded");
		});

		return certificationElement;
	}

	#renderError(containerId) {
		const container = document.getElementById(containerId);
		if (container) {
			container.innerHTML = `<p class="error">Une erreur s'est produite lors du chargement des certifications. Veuillez réessayer plus tard.</p>`;
		}
	}
}

export const certificationService = new CertificationService();