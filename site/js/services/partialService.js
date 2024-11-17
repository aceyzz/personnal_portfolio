class PartialService {
	async load(url) {
		const response = await fetch(url);
		if (!response.ok) throw new Error(`Failed to load partial: ${url}`);
		return await response.text();
	}
}

export const partialService = new PartialService();