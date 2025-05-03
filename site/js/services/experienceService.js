import CollapsibleService from "./CollapsibleService.js";
import { languageService } from "./languageService.js";

export const experienceService = new CollapsibleService(`/data/${languageService.getLanguage()}/experience.json`);