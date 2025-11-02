import { projectService } from "./projectService.js";
import { renderService } from "./renderService.js";

class CategoryService {
	#allProjects = [];
	#categories = [];
	#activeCategory = null;

	constructor(jsonPath, filterContainerId, cardContainerId) {
		this.jsonPath = jsonPath;
		this.filterContainerId = filterContainerId;
		this.cardContainerId = cardContainerId;
	}

	async init() {
		try {
			const response = await fetch(this.jsonPath);
			if (!response.ok) throw new Error("Failed to fetch projects");
			const data = await response.json();

			this.#extractProjectsAndCategories(data);
			this.#renderCategoryCards();
			this.#activateFirstCategory();
		} catch {
			renderService.showError(this.cardContainerId, "Failed to load projects");
		}
	}

	#extractProjectsAndCategories(data) {
		const categoriesSet = new Set();
		this.#allProjects = [];

		if (data?.projects) {
			data.projects.forEach(project => {
				if (Array.isArray(project.category)) {
					for (const cat of project.category) {
						categoriesSet.add(cat);
					}
				}
				this.#allProjects.push(project);
			});
		}
		else {
			throw new Error("Invalid data structure. Expected 'projects' array.");
		}
		this.#categories = ["all", ...Array.from(categoriesSet).sort()];
	}

	#renderCategoryCards() {
		const container = document.getElementById(this.filterContainerId);
		if (!container) return;

		container.innerHTML = "";

		this.#categories.forEach(category => {
			const card = document.createElement("div");
			card.className = "category-card";
			card.dataset.category = category;
			card.innerHTML = category === "all" ? "All" : CategoryService.#formatCategoryLabel(category);
			card.onclick = () => this.#onCategoryClick(category);
			container.appendChild(card);
		});
	}

	#activateFirstCategory() {
		const firstCategory = this.#categories.includes("all") ? "all" : this.#categories[0];
		if (firstCategory) this.#onCategoryClick(firstCategory);
	}

	#onCategoryClick(category) {
		if (category === this.#activeCategory) return;
		this.#activeCategory = category;

		document.querySelectorAll(".category-card").forEach(card => {
			card.classList.toggle("active", card.dataset.category === category);
		});

		const filteredProjects = category === "all"
			? this.#allProjects
			: this.#allProjects.filter(
				p => Array.isArray(p.category) && p.category.includes(category)
			);

		const container = document.getElementById(this.cardContainerId);
		if (!container) return;

		const title = category === "all" ? "All" : category;
		projectService.render(container, [
			{
				category: title,
				items: filteredProjects.map(p => projectService.mapProject(p, category))
			}
		]);
	}

	static #formatCategoryLabel(raw) {
		return raw.replace(/ *[&/] */g, '\n');
	}
}

export default CategoryService;
