import { languageService } from "./languageService.js";

class LangSelectorService {
    constructor() {
        this.init();
    }

    init() {
        this.langSelector = document.getElementById("language-selector");
        this.langIcon = document.getElementById("lang-icon");
        this.langMenu = document.getElementById("lang-menu");

        if (!this.langSelector || !this.langIcon || !this.langMenu) {
            console.error("LangSelectorService: Éléments HTML introuvables.");
            return;
        }

        this.loadLanguages();
        this.setupEventListeners();
    }

    loadLanguages() {
        const currentLang = languageService.getLanguage();
        const languages = languageService.getAvailableLanguages();

        this.langIcon.src = languages[currentLang].icon;
        this.langMenu.innerHTML = "";
        Object.entries(languages).forEach(([lang, { name, icon }]) => {
            const li = document.createElement("li");
            li.innerHTML = `<img src="${icon}" alt="${name}"> ${name}`;
            li.addEventListener("click", () => languageService.setLanguage(lang));
            this.langMenu.appendChild(li);
        });
    }

    setupEventListeners() {
        this.langSelector.addEventListener("click", (e) => {
            e.stopPropagation();
            this.langMenu.classList.toggle("show");
        });

        document.addEventListener("click", (e) => {
            if (!this.langSelector.contains(e.target)) {
                this.langMenu.classList.remove("show");
            }
        });
    }
}

export const langSelectorService = new LangSelectorService();
