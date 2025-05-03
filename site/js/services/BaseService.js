import { renderService } from "./renderService.js";

class BaseService {
	constructor(jsonPath, renderCallback) {
		this.jsonPath = jsonPath;
		this.renderCallback = renderCallback;
	}

	async init(containerId) {
		const container = document.getElementById(containerId);
		if (!container) throw new Error(`Container with ID "${containerId}" not found.`);
		try {
			const data = await this.fetchData();
			this.render(container, data);
		} catch (error) {
			console.error(error);
			renderService.showError(containerId, "Impossible de charger les données.");
		}
	}

	async fetchData() {
		const response = await fetch(this.jsonPath);
		if (!response.ok) {
			const message = `Erreur de chargement (${response.status}): ${response.statusText}`;
			throw new Error(message);
		}
		return await response.json();
	}

	render(container, data) {
		if (typeof this.renderCallback !== "function")
			throw new Error("La méthode de rendu n'a pas été définie.");
		container.innerHTML = "";
		this.renderCallback(container, data);
	}
}

export default BaseService;