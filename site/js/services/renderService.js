class RenderService {
	showLoading(targetElement) {
		if (!targetElement) return console.error("Aucun élément cible spécifié pour afficher le spinner.");
		if (targetElement.querySelector('[aria-busy="true"]')) return;

		const spinner = document.createElement("article");
		spinner.setAttribute("aria-busy", "true");
		Object.assign(spinner.style, {
			display: "inline-flex",
			justifyContent: "center",
			alignItems: "center",
			width: "30px",
			height: "30px",
			background: "none",
		});
		targetElement.appendChild(spinner);
	}

	hideLoading(targetElement) {
		if (!targetElement) return console.error("Aucun élément cible spécifié pour retirer le spinner.");
		const spinner = targetElement.querySelector('[aria-busy="true"]');
		if (spinner) targetElement.removeChild(spinner);
	}

	showError(containerId, message = "Une erreur est survenue.") {
		const container = document.getElementById(containerId);
		if (container)
			container.innerHTML = `<p class="error">${message}</p>`;
	}
}

export const renderService = new RenderService();