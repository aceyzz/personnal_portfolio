import CollapsibleService from "./CollapsibleService.js";
import { languageService } from "./languageService.js";

export const certificationService = new CollapsibleService(`/data/${languageService.getLanguage()}/certification.json`);