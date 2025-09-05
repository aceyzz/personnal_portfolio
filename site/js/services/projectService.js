import CollapsibleService from "./CollapsibleService.js";
import CategoryService from "./categoryService.js";
import { languageService } from "./languageService.js";

const service = new CollapsibleService(`/data/${languageService.getLanguage()}/projects.json`);

service.mapProject = function (project, categoryName) {
	return {
		title: project.title,
		logo: project.logo,
		date: project.date,
		description: project.description,
		details: project.detail,
		skills: project.technologies,
		repo: project.repo,
		banner: project.banner,
	};
};

service.init = function (containerId) {
	const jsonPath = `/data/${languageService.getLanguage()}/projects.json`;
	const categoryService = new CategoryService(jsonPath, "project-filters", containerId);
	categoryService.init();
};

export const projectService = service;
