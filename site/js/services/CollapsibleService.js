import { renderService } from "./renderService.js";
import { languageService } from "./languageService.js";

class CollapsibleService {
	constructor(jsonPath) {
		this.jsonPath = jsonPath;
	}

	async init(containerId) {
		const container = document.getElementById(containerId);
		if (!container) throw new Error(`Container with ID "${containerId}" not found.`);
		try {
			const data = await this.fetchData();
			this.render(container, this.flattenData(data));
		} catch (error) {
			console.error(error);
			renderService.showError(containerId, this.getTranslation("error_loading"));
		}
	}

	async fetchData() {
		const response = await fetch(this.jsonPath);
		if (!response.ok) throw new Error(`Failed to fetch data from ${this.jsonPath}`);
		return await response.json();
	}

	flattenData(data) {
		const categories = [];

		if (data.certifications) {
			categories.push({
				category: this.getTranslation("certifications"),
				items: data.certifications.map(this.mapCertification)
			});
		}
		if (data.experiences) {
			categories.push({
				category: this.getTranslation("experiences"),
				items: data.experiences.map(this.mapExperience)
			});
		}
		if (data.categories) {
			data.categories.forEach(category => {
				categories.push({
					category: category.name,
					items: category.projects.map(project => this.mapProject(project, category.name))
				});
			});
		}

		if (categories.length === 0) throw new Error("Invalid data structure. Expected 'certifications', 'categories', or 'experiences'.");
		return categories;
	}

	mapCertification(cert) {
		return {
			title: cert.title,
			logo: cert.logo,
			company: cert.company,
			date: cert.date,
			description: cert.description,
			details: null,
			skills: cert.skills,
		};
	}

	mapProject(project, categoryName) {
		return {
			title: project.title,
			logo: project.logo,
			date: project.date,
			description: project.description,
			details: project.detail,
			skills: project.technologies,
			repo: project.repo,
		};
	}

	mapExperience(exp) {
		return {
			title: exp.title,
			logo: exp.logo,
			company: exp.company,
			date: exp.duration,
			description: exp.description,
			details: null,
			skills: exp.skills,
		};
	}

	render(container, groupedItems) {
		container.innerHTML = "";
		groupedItems.forEach(group => {
			if (group.category) {
				const categoryTitle = this.createCategoryTitle(group.category);
				container.appendChild(categoryTitle);
			}
			group.items.forEach((item, index) => {
				const element = this.createCollapsibleElement(item);
				container.appendChild(element);
				if (index === group.items.length - 1) {
					const hr = document.createElement("hr");
					hr.className = "separator";
					container.appendChild(hr);
				}
			});
		});
	}

	createCategoryTitle(category) {
		const titleElement = document.createElement("h3");
		titleElement.className = "collapsible-category-title";
		titleElement.textContent = category;
		return titleElement;
	}

	getTranslation(key) {
		const translations = {
			en: {
				project: "Project",
				details: "Details",
				skills: "Acquired Skills",
				error_loading: "Unable to load data.",
				experiences: "Experiences",
				certifications: "Certifications",
				link: "Project Link"
			},
			fr: {
				project: "Projet",
				details: "Détails",
				skills: "Compétences acquises",
				error_loading: "Impossible de charger les données.",
				experiences: "Expériences",
				certifications: "Certifications",
				link: "Lien du projet"
			},
			de: {
				project: "Projekt",
				details: "Details",
				skills: "Erworbene Fähigkeiten",
				error_loading: "Daten konnten nicht geladen werden.",
				experiences: "Erfahrungen",
				certifications: "Zertifizierungen",
				link: "Projektlink"
			},
			es: {
				project: "Proyecto",
				details: "Detalles",
				skills: "Habilidades adquiridas",
				error_loading: "No se pueden cargar los datos.",
				experiences: "Experiencias",
				certifications: "Certificaciones",
				link: "Enlace del proyecto"
			}
		};
		const lang = languageService.getLanguage();
		languageService.ensureValidLanguage();
		return translations[lang][key] || key;
	}

	createCollapsibleElement(item) {
		const { title, logo, date, description, details, skills, repo, company } = item;
	
		const element = document.createElement("div");
		element.className = "collapsible collapsed";
	
		element.innerHTML = `
			<h2 class="collapsible-header">
				${logo ? `<img src="${logo}" alt="${title}" class="logo" />` : ""}
				${title}
			</h2>
			<div class="collapsible-body">
				<div class="collapsible-content">
					${company ? `<h4 class="company">${company}</h4>` : ""}
					${date ? `<p class="date" style="color: var(--secondary);">${date}</p>` : ""}
					${description ? `<h4>${this.getTranslation("project")}</h4><p class="description">${description}</p>` : ""}
					${details ? `<h4>${this.getTranslation("details")}</h4><p class="details">${details}</p>` : ""}
					${skills ? `<h4>${this.getTranslation("skills")}</h4><div class="skills">${skills.map(skill => `<span class="skill">${skill}</span>`).join("")}</div>` : ""}
					${repo ? `<a href="${repo}" target="_blank" class="repo-link">${this.getTranslation("link")}</a>` : ""}
				</div>
			</div>
		`;

		if (!repo) {
			const repoLink = element.querySelector(".repo-link");
			if (repoLink) repoLink.style.display = "none";
		}
	
		element.querySelector(".collapsible-header").addEventListener("click", () => {
			element.classList.toggle("collapsed");
			element.classList.toggle("expanded");
		});
	
		return element;
	}
}

export default CollapsibleService;
