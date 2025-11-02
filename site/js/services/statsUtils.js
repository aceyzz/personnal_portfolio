import { renderService } from "./renderService.js";

const LANGS = [
	"C", "C++", "Python", "JavaScript", "Bash", "PowerShell", "Go", "Swift", "HTML", "CSS", "SQL"
];
const TOOLS = [
	"Git", "Docker", "Kubernetes", "Node.js", "CI/CD", "Linux", "Nginx", "Cloud", "VM", "API"
];

const MAP_ALIAS = {
	"C++11": "C++", "C++17": "C++", "JS": "JavaScript", "TypeScript": "JavaScript", "Shell": "Bash", "Shell scripting": "Bash", "PowerShell": "PowerShell", "Golang": "Go", "HTML5": "HTML", "CSS3": "CSS",
	"PostgreSQL": "SQL", "Postgres": "SQL", "MySQL": "SQL", "MariaDB": "SQL",
	"GitHub": "Git",
	"Compose": "Docker", "Dockerfile": "Docker",
	"K8s": "Kubernetes", "K3s": "Kubernetes", "K3d": "Kubernetes",
	"NodeJS": "Node.js",
	"GitHub CI/CD": "CI/CD", "GitLab CI": "CI/CD", "Argo CD": "CI/CD",
	"Debian": "Linux",
	"NGINX": "Nginx", "Reverse Proxy": "Nginx",
	"Azure": "Cloud", "AWS": "Cloud", "GCP": "Cloud",
	"Virtual Machine": "VM", "Citrix": "VM",
	"REST API": "API", "RESTful API": "API"
};

const LEVELS = [
	{ min: 0, max: 200, level: 1 },			// Bronze
	{ min: 200, max: 500, level: 2 },		// Silver
	{ min: 500, max: 900, level: 3 },		// Gold
	{ min: 900, max: 1500, level: 4 },		// Platinum
	{ min: 1500, max: Infinity, level: 5 }	// Diamond
];

export class StatsCalculator {
	constructor(items) {
		this.items = items || [];
	}

	static canon(key) {
		if (MAP_ALIAS[key]) return MAP_ALIAS[key];
		return key;
	}

	static inScopeLang(key) {
		return LANGS.includes(key);
	}

	static inScopeTool(key) {
		return TOOLS.includes(key);
	}

	compute() {
		const langScores = {};
		const toolScores = {};
		const domainScores = {};

		this.items.forEach(item => {
			const cx = Number(item.complexity) || 0;
			const stack = item.stack || {};
			Object.entries(stack).forEach(([rawKey, pct]) => {
				const key = StatsCalculator.canon(rawKey);
				const contrib = (Number(pct) || 0) / 100 * cx;
				if (StatsCalculator.inScopeLang(key)) {
					langScores[key] = (langScores[key] || 0) + contrib;
				} else if (StatsCalculator.inScopeTool(key)) {
					toolScores[key] = (toolScores[key] || 0) + contrib;
				}
			});

			const domains = Array.isArray(item.domain) ? item.domain : [];
			domains.forEach(d => {
				const dn = d.name;
				const w = Number(d.weight) || 0;
				const contrib = w / 100 * cx;
				if (!dn) return;
				domainScores[dn] = (domainScores[dn] || 0) + contrib;
			});
		});

		const langs = this.toArray(langScores);
		const tools = this.toArray(toolScores);
		const domains = this.toArray(domainScores);

		const langsScaled = this.scaleForLevels(langs);
		const toolsScaled = this.scaleForLevels(tools);
		const domainsScaled = this.scaleForLevels(domains);

		return {
			languages: this.withLevels(langsScaled),
			tools: this.withLevels(toolsScaled),
			domains: this.withLevels(domainsScaled)
		};
	}

	toArray(obj) {
		return Object.entries(obj)
			.map(([name, score]) => ({ name, score }))
			.sort((a, b) => b.score - a.score);
	}

	percentile(arr, p) {
		if (!arr.length) return 0;
		const a = [...arr].sort((x, y) => x - y);
		const idx = (p / 100) * (a.length - 1);
		const lo = Math.floor(idx);
		const hi = Math.ceil(idx);
		if (lo === hi) return a[lo];
		const t = idx - lo;
		return a[lo] * (1 - t) + a[hi] * t;
	}

	scaleForLevels(arr, targetTop = 900, perc = 95) {
		const scores = arr.map(x => x.score);
		const p95 = this.percentile(scores, perc) || 1;
		const factor = Math.max(1, p95 / targetTop);
		return arr.map(x => ({ ...x, score: x.score / factor }));
	}

	withLevels(arr) {
		return arr.map(x => {
			const { level, min, max } = this.levelInfo(x.score);
			const progress = this.levelProgress(x.score, min, max);
			return { ...x, level, progress };
		});
	}

	levelInfo(score) {
		for (const l of LEVELS) {
			if (score >= l.min && score <= l.max) return { level: l.level, min: l.min, max: l.max };
			if (l.max === Infinity && score >= l.min) return { level: l.level, min: l.min, max: l.max };
		}
		return { level: 1, min: 0, max: 100 };
	}

	levelProgress(score, min, max) {
		if (max === Infinity) return 1;
		const denom = max - min || 1;
		const p = (score - min) / denom;
		return Math.max(0, Math.min(1, p));
	}
}

export class StatsRenderer {
	createViewport() {
		const vp = document.createElement("div");
		vp.className = "stats-viewport";
		const wrap = document.createElement("div");
		wrap.className = "stats-wrap";
		vp.appendChild(wrap);
		return { vp, wrap };
	}

	createCard(title) {
		const card = document.createElement("div");
		card.className = "stats-card";
		const h = document.createElement("h3");
		h.className = "stats-card__title";
		h.textContent = title;
		const list = document.createElement("div");
		list.className = "stats-list";
		card.appendChild(h);
		card.appendChild(list);
		return card;
	}

	tier(level) {
		if (level >= 5) return { name: "Diamond", cls: "tier--diamond" };
		if (level === 4) return { name: "Platinum", cls: "tier--platinum" };
		if (level === 3) return { name: "Gold", cls: "tier--gold" };
		if (level === 2) return { name: "Silver", cls: "tier--silver" };
		return { name: "Bronze", cls: "tier--bronze" };
	}

	createRow(item, i) {
		const row = document.createElement("div");
		row.className = "stats-row";
		row.setAttribute("data-level", String(item.level));
		row.style.animationDelay = `${Math.min(i * 30, 300)}ms`;

		const name = document.createElement("div");
		name.className = "stats-row__name";
		name.textContent = item.name;

		const barWrap = document.createElement("div");
		barWrap.className = "stats-row__bar";

		const bar = document.createElement("div");
		bar.className = "stats-row__bar-fill";
		requestAnimationFrame(() => {
			bar.style.width = Math.round(100 * item.progress) + "%";
		});
		barWrap.appendChild(bar);

		const meta = document.createElement("div");
		meta.className = "stats-row__meta";
		const tier = this.tier(item.level);
		meta.innerHTML = `<span class="stats-row__meta-text ${tier.cls}">Lvl. ${item.level} · ${Math.round(item.score).toLocaleString("en-US")} XP · ${tier.name}</span>`;

		row.appendChild(name);
		row.appendChild(barWrap);
		row.appendChild(meta);
		return row;
	}

	render(container, data) {
		container.innerHTML = "";
		const { vp, wrap } = this.createViewport();

		const cardLang = this.createCard("Languages");
		data.languages.forEach((i, n) => cardLang.querySelector(".stats-list").appendChild(this.createRow(i, n)));

		const cardTools = this.createCard("Tools");
		data.tools.forEach((i, n) => cardTools.querySelector(".stats-list").appendChild(this.createRow(i, n)));

		const cardDomains = this.createCard("Domains");
		data.domains.forEach((i, n) => cardDomains.querySelector(".stats-list").appendChild(this.createRow(i, n)));

		wrap.appendChild(cardLang);
		wrap.appendChild(cardTools);
		wrap.appendChild(cardDomains);
		container.appendChild(vp);
	}
}

export class StatsDataService {
	constructor(jsonPath = "/data/stats.json") {
		this.jsonPath = jsonPath;
	}

	async load() {
		const res = await fetch(this.jsonPath);
		if (!res.ok) throw new Error("Failed to load stats.json");
		const data = await res.json();
		return this.normalize(data);
	}

	normalize(data) {
		const items = [];
		(data.projects || []).forEach(p =>
			items.push({
				type: "project",
				title: p.title,
				complexity: p.complexity,
				stack: p.stack || {},
				domain: p.domain || []
			})
		);
		(data.certifications || []).forEach(c =>
			items.push({
				type: "certification",
				title: c.title,
				complexity: c.complexity,
				stack: c.stack || {},
				domain: c.domain || []
			})
		);
		(data.experiences || []).forEach(e =>
			items.push({
				type: "experience",
				title: e.title,
				complexity: e.complexity,
				stack: e.stack || {},
				domain: e.domain || []
			})
		);
		return items;
	}

	static showError(containerId, message) {
		renderService.showError(containerId, message || "Unable to load data.");
	}
}
