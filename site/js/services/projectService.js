class ProjectService {
	#jsonPath = "/data/projects/list.json";
	#categories = [];

	async init(containerId) {
		try {
			this.#categories = await this.#fetchProjects();
			this.#render(containerId);
		} catch (error) {
			console.error("Error initializing ProjectService:", error);
			this.#renderError(containerId);
		}
	}

	async #fetchProjects() {
		const response = await fetch(this.#jsonPath);
		if (!response.ok) {
			throw new Error(`Failed to fetch project data from ${this.#jsonPath}`);
		}
		const data = await response.json();
		return data.categories;
	}

	#render(containerId) {
		const container = document.getElementById(containerId);
		if (!container) {
			throw new Error(`Container with ID "${containerId}" not found.`);
		}
		container.innerHTML = "";

		this.#categories.forEach((category) => {
			const categoryElement = this.#createCategoryElement(category);
			container.appendChild(categoryElement);
		});
	}

	#createCategoryElement(category) {
		const categoryElement = document.createElement("div");
		categoryElement.className = "category collapsed";
		categoryElement.innerHTML = `
			<h2>${category.name}</h2>
			<ul></ul>
		`;

		const projectsList = categoryElement.querySelector("ul");
		category.projects.forEach((project) => {
			const projectElement = this.#createProjectElement(project);
			projectsList.appendChild(projectElement);
		});

		categoryElement.querySelector("h2").addEventListener("click", () => {
			categoryElement.classList.toggle("expanded");
			categoryElement.classList.toggle("collapsed");
		});

		return categoryElement;
	}

	#createProjectElement(project) {
		const projectElement = document.createElement("li");
		projectElement.className = "project";
		projectElement.innerHTML = `
			<img src="${project.logo}" alt="${project.title}" />
			<div class="project-info">
				<div class="project-title">${project.title}</div>
				<div class="project-date">${project.date}</div>
				<div class="project-details">
					<h3>Description</h3>
					<p>${project.description}</p>
					<h3>Détails</h3>
					<p>${project.detail}</p>
					<h3>Technologies utilisées</h3>
					<p>${project.technologies.join(", ")}</p>
					<a href="${project.repo}" target="_blank">Voir sur GitHub</a>
				</div>
			</div>
		`;

		projectElement.addEventListener("click", () => {
			const details = projectElement.querySelector(".project-details");
			details.classList.toggle("visible");
		});

		return projectElement;
	}

	#renderError(containerId) {
		const container = document.getElementById(containerId);
		if (container) {
			container.innerHTML = `<p class="error">Une erreur s'est produite lors du chargement des projets. Veuillez réessayer plus tard.</p>`;
		}
	}
}

export const projectService = new ProjectService();
