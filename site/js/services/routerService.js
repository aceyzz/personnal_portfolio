import { partialService } from "./partialService.js";
import { projectService } from "./projectService.js";
import { experienceService } from "./experienceService.js";
import { certificationService } from "./certificationService.js";

class RouterService {
	#container;
	#routes = {};
	#currentRoute = null;

	setup(container) {
		this.#container = container;
	}

	start() {
		window.addEventListener("popstate", () => {
			this.#loadRoute(window.location.pathname);
		});

		this.#attachRouteListeners();
		this.#loadRoute(window.location.pathname);
	}

	addRoute(path, options) {
		this.#routes[path] = options;
	}

	async navigate(path) {
		if (this.#currentRoute === path) return;
		window.history.pushState({}, "", path);
		await this.#loadRoute(path);
	}

	async #loadRoute(path) {
		if (this.#currentRoute === path) return;
		this.#currentRoute = path;

		const route = this.#routes[path] || this.#routes["/"];
		const html = await partialService.load(route.partial);
		this.#container.innerHTML = html;
		this.#handleRouteActions(path);
		this.#attachRouteListeners();
	}

	#attachRouteListeners() {
		document.querySelectorAll("[data-route]").forEach((link) => {
			link.addEventListener("click", (e) => {
				e.preventDefault();
				const path = e.currentTarget.getAttribute("href");
				this.navigate(path);
			});
		});
	}

	#handleRouteActions(path) {
		switch (path) {
			case "/projects":
				projectService.init("project-container");
				break;
			case "/experience":
				experienceService.init("experience-container");
				certificationService.init("certification-container");
				break;
			default:
				break;
		}
	}
}

export const routerService = new RouterService();