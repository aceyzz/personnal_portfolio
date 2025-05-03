class LanguageService {
    constructor() {
        this.languages = {
            fr: { name: "FR", icon: "https://img.icons8.com/?size=100&id=3muzEmi4dpD5&format=png&color=000000" },
            en: { name: "EN", icon: "https://img.icons8.com/?size=100&id=t3NE3BsOAQwq&format=png&color=000000" },
			de: { name: "DE", icon: "https://img.icons8.com/?size=100&id=vRrbNnaD93Ys&format=png&color=000000" },
			es: { name: "ES", icon: "https://img.icons8.com/?size=100&id=MRQWA3gxIrCt&format=png&color=000000" }
        };
        this.defaultLang = "fr";
        this.lang = localStorage.getItem("lang") || this.defaultLang;
        this.ensureValidLanguage();
    }

    ensureValidLanguage() {
        if (!this.languages[this.lang]) {
            this.lang = this.defaultLang;
            localStorage.setItem("lang", this.lang);
        }
    }

    setLanguage(lang) {
        if (this.languages[lang]) {
            localStorage.setItem("lang", lang);
            window.location.reload();
        }
    }

    getLanguage() {
        return this.lang;
    }

    getAvailableLanguages() {
        return this.languages;
    }
}

export const languageService = new LanguageService();
