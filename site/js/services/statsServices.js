import { StatsCalculator, StatsDataService, StatsRenderer } from "./statsUtils.js";
import { renderService } from "./renderService.js";

class StatsService {
  constructor(jsonPath = "/data/stats.json") {
    this.dataService = new StatsDataService(jsonPath);
    this.renderer = new StatsRenderer();
  }

  async init(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    try {
      const items = await this.dataService.load();
      const calculator = new StatsCalculator(items);
      const result = calculator.compute();
      this.renderer.render(container, result);
    } catch (e) {
      renderService.showError(containerId, "Unable to load data.");
    }
  }
}

export const statsService = new StatsService();
