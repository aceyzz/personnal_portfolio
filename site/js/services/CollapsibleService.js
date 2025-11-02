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

		if (categories.length === 0) throw new Error("Invalid data structure. Expected 'certifications', 'categories', or 'experiences'.");
		return categories;
	}

	mapCertification(cert) {
		return {
			title: cert.title,
			logo: cert.logo,
			company: cert.company,
			date: cert.date,
			description: null,
			details: cert.description,
			skills: cert.skills,
		};
	}

	mapExperience(exp) {
		return {
			title: exp.title,
			logo: exp.logo,
			company: exp.company,
			date: exp.duration,
			description: null,
			details: exp.description,
			tasks: exp.tasks || [],
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
		const titleElement = document.createElement("h4");
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
				tasks: "Tasks",
				error_loading: "Unable to load data.",
				experiences: "Experiences",
				certifications: "Certifications",
				link: "Project Link"
			},
			fr: {
				project: "Projet",
				details: "Détails",
				tasks: "Tâches",
				skills: "Compétences acquises",
				error_loading: "Impossible de charger les données.",
				experiences: "Expériences",
				certifications: "Certifications",
				link: "Lien du projet"
			},
			de: {
				project: "Projekt",
				details: "Details",
				tasks: "Aufgaben",
				skills: "Erworbene Fähigkeiten",
				error_loading: "Daten konnten nicht geladen werden.",
				experiences: "Erfahrungen",
				certifications: "Zertifizierungen",
				link: "Projektlink"
			},
			es: {
				project: "Proyecto",
				details: "Detalles",
				tasks: "Tareas",
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
		const {
			title, logo, date, description,
			details, tasks, skills, repo, company, banner
		} = item;

		const wrapper = document.createElement("div");
		wrapper.className = "collapsible collapsed";

		const logoHTML = logo ? `<img src="${logo}" alt="${title}" class="logo" />` : "";
		const bannerHTML = banner ? `<img src="${banner}" alt="Banner" class="banner-image" />` : "";
		const companyHTML = company ? `<h4 class="company">${company}</h4>` : "";
		const dateHTML = date ? `<p class="date" style="color: var(--secondary);">${date}</p>` : "";
		const descHTML = description ? `<h4>${this.getTranslation("project")}</h4><p style="font-size:0.80em !important;">${description}</p>` : "";
		const detailsHTML = details ? `<h4>${this.getTranslation("details")}</h4><p style="font-size:0.80em !important;">${details}</p>` : "";
		const tasksHTML = item.tasks ? `<h4>${this.getTranslation("tasks")}</h4><ul>${item.tasks.map(task => `<li style="font-size:0.80em;">${task}</li>`).join("")}</ul>` : "";
		const skillsHTML = skills ? `<h4>${this.getTranslation("skills")}</h4><div class="skills">${skills.map(s => `<span class="skill">${s}</span>`).join("")}</div>` : "";
		const linkHTML = repo ? `<a href="${repo}" target="_blank" class="repo-link">${this.getTranslation("link")}</a>` : "";

		wrapper.innerHTML = `
			<h2 class="collapsible-header">${logoHTML}${title}</h2>
			<div class="collapsible-body">
				<div class="collapsible-content">
					${companyHTML}
					${dateHTML}
					${bannerHTML}
					${descHTML}
					${detailsHTML}
					${tasksHTML}
					${skillsHTML}
					${linkHTML}
				</div>
			</div>
		`;

		wrapper.querySelector(".collapsible-header").addEventListener("click", () => {
			wrapper.classList.toggle("collapsed");
			wrapper.classList.toggle("expanded");
		});

		return wrapper;
	}
}

export default CollapsibleService;
