import CollapsibleService from "./CollapsibleService.js";
import { languageService } from "./languageService.js";

export const projectService = new CollapsibleService(`/data/${languageService.getLanguage()}/projects.json`);