class CursorHaloService {
	#haloElement;
	#isHovered = false;

	constructor() {
		this.#createHaloElement();
		this.#attachListeners();
	}

	#createHaloElement() {
		this.#haloElement = document.createElement("div");
		this.#haloElement.id = "cursor-halo";
		this.#haloElement.classList.add("cursor-halo");
		document.body.appendChild(this.#haloElement);
	}

	#attachListeners() {
		document.addEventListener("mousemove", (e) => this.#updateHaloPosition(e));
		document.querySelectorAll("a, button").forEach((element) => {
			element.addEventListener("mouseenter", () => this.#onElementHover());
			element.addEventListener("mouseleave", () => this.#onElementLeave());
		});
	}

	#updateHaloPosition(e) {
		const offsetX = this.#haloElement.offsetWidth / 2;
		const offsetY = this.#haloElement.offsetHeight / 2;
		this.#haloElement.style.transform = `translate(${e.clientX - offsetX}px, ${e.clientY - offsetY}px)`;
	}

	#onElementHover() {
		if (!this.#isHovered) {
			this.#isHovered = true;
			this.#haloElement.classList.add("hover");
		}
	}

	#onElementLeave() {
		if (this.#isHovered) {
			this.#isHovered = false;
			this.#haloElement.classList.remove("hover");
		}
	}
}

export const cursorHaloService = new CursorHaloService();