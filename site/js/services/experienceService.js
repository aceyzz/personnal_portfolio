class ExperienceService {
	#jsonPath = "/data/experience.json";
	#experiences = [];

	async init(containerId) {
		try {
			this.#experiences = await this.#fetchExperiences();
			this.#render(containerId);
		} catch (error) {
			console.error("Error initializing ExperienceService:", error);
			this.#renderError(containerId);
		}
	}

	async #fetchExperiences() {
		const response = await fetch(this.#jsonPath);
		if (!response.ok) {
			throw new Error(`Failed to fetch experience data from ${this.#jsonPath}`);
		}
		const data = await response.json();
		return data.experiences;
	}

	#render(containerId) {
		const container = document.getElementById(containerId);
		if (!container) {
			throw new Error(`Container with ID "${containerId}" not found.`);
		}
		container.innerHTML = "";

		this.#experiences
			.sort((a, b) => b.id - a.id)
			.forEach((experience) => {
				const experienceElement = this.#createExperienceElement(experience);
				container.appendChild(experienceElement);
			});
	}

	#createExperienceElement(experience) {
		const experienceElement = document.createElement("div");
		experienceElement.className = "experience collapsed";
		experienceElement.innerHTML = `
			<h2 class="experience-toggle" style="margin: 0;">
				<img src="${experience.logo}" alt="${experience.company}" class="experience-logo" />
				${experience.company}
			</h2>
			<div class="experience-body">
				<div class="experience-header">
					<h3 class="experience-title" style="margin: 0;">${experience.title}</h3>
					<p class="experience-duration">${experience.duration}</p>
					<p class="experience-location">${experience.location}</p>
				</div>
				<div class="experience-details">
					<h4>Description</h4>
					<p>${experience.description}</p>
					<h4>Tâches principales</h4>
					<ul>${experience.tasks.map((task) => `<li>${task}</li>`).join("")}</ul>
					<h4>Compétences acquises</h4>
					<div class="skills">
						${experience.skills.map((skill) => `<span class="skill">${skill}</span>`).join("")}
					</div>
				</div>
			</div>
		`;

		experienceElement.querySelector(".experience-toggle").addEventListener("click", () => {
			experienceElement.classList.toggle("collapsed");
			experienceElement.classList.toggle("expanded");
		});

		return experienceElement;
	}

	#renderError(containerId) {
		const container = document.getElementById(containerId);
		if (container) {
			container.innerHTML = `<p class="error">Une erreur s'est produite lors du chargement des expériences. Veuillez réessayer plus tard.</p>`;
		}
	}
}

export const experienceService = new ExperienceService();
