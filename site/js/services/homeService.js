import { languageService } from "./languageService.js";

class HomeService {
    async init(containerId) {
        const container = document.getElementById(containerId);
        if (!container) throw new Error(`Container with ID "${containerId}" not found.`);

        try {
            const data = await this.fetchData();
            this.render(container, data);
        } catch (error) {
            console.error(error);
            container.innerHTML = `<p class="error">Impossible de charger les données.</p>`;
        }
    }

    async fetchData() {
        const lang = languageService.getLanguage();
        const response = await fetch(`/data/${lang}/home.json`);
        if (!response.ok) throw new Error(`Failed to fetch data: ${response.statusText}`);
        return await response.json();
    }

    render(container, data) {
        container.innerHTML = `
            <div style="text-align: center; margin-bottom: 2rem; margin-top: 2rem;">
                <img src="../assets/profile.png" alt="${data.title}" style="width: 150px; border-radius: 50%; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            </div>
            <h2 style="text-align: center;">${data.title}</h2>
            <p style="text-align: center; font-size: 1.2rem; color: #555;">${data.subtitle}</p>
            <section class="container">
                <p style="text-align: center; line-height: 1.8; font-size: 1.1rem;">
                    ${data.description.map(line => `${line}<br>`).join("")}
                </p>
            </section>
            <section class="container">
                <div class="grid" style="text-align: center; margin-top: 2rem;">
                    <a data-route href="/projects" class="secondary" role="button" style="padding: 10px 20px; font-size: 1rem; margin-top: 10px;">${data.buttons.projects}</a>
                    <a data-route href="/contact" class="outline" role="button" style="padding: 10px 20px; font-size: 1rem; margin-top: 10px;">${data.buttons.contact}</a>
                </div>
            </section>
            <section class="container" style="margin-top: 3rem;">
                <hr>
            </section>
        `;
    }
}

export const homeService = new HomeService();