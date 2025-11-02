import { languageService } from "./languageService.js";
import { renderService } from "./renderService.js";

class ContactService {
	async init(noteElementId) {
		const el = document.getElementById(noteElementId);
		if (!el) return;

		try {
			const lang = languageService.getLanguage();
			const res = await fetch(`/data/${lang}/contact.json`);
			if (!res.ok) throw new Error(`Failed to fetch contact.json (${lang})`);
			const data = await res.json();

			if (Array.isArray(data.stats_note)) {
				el.innerHTML = data.stats_note.map(line => `${line}<br>`).join("");
			} else {
				el.innerHTML = data.stats_note || "";
			}
		} catch (e) {
			console.error(e);
			renderService.showError(noteElementId, "Unable to load data.");
		}
	}
}

export const contactService = new ContactService();
