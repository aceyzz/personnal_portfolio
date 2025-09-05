
# 🖥️ Portfolio

Bienvenue sur le repository de mon **Portfolio**, un site web personnel moderne et interactif pour présenter mes projets, expériences et certifications.

<br>

## 🌟 Fonctionnalités

- **Page d'accueil** : Présentation élégante et introduction à mon portfolio.
- **Projets** : Liste dynamique et détaillée de mes projets, avec catégories déroulantes, descriptions interactives et bannières illustratives.
- **Expériences** : Affichage interactif de mes expériences professionnelles, avec détails, compétences acquises et tâches principales.
- **Certifications** : Section dédiée à mes certifications obtenues, avec les compétences et technologies associées.
- **Contact** : Grille moderne de liens vers mes réseaux sociaux pour faciliter la communication.
- **Multilingue** : Prise en charge de plusieurs langues (français, anglais, espagnol, allemand) via des fichiers JSON.
- **Effets interactifs** : Animations CSS, halo de curseur personnalisé et transitions fluides.
- **Architecture SPA** : Navigation sans rechargement grâce à un système de routage maison.

<br>

## 🛠️ Technologies utilisées

- **Frontend** : HTML5, CSS3, JavaScript (Vanilla)
- **UI Framework** : [Pico.css](https://picocss.com) pour une base épurée et réactive
- **Effets interactifs** : Animations CSS, gestion dynamique avec JavaScript
- **Architecture SPA** : Routage personnalisé, chargement partiel des pages
- **Icons** : [Icons8](https://icons8.com) pour les éléments graphiques

<br>

## 📂 Structure du projet

Organisation des fichiers :

```
index.html                  # Fichier principal du site
Caddyfile                   # Configuration serveur local
staticwebapp.config.json    # Configuration Azure Static Web Apps
/assets                     # Ressources statiques
	├── logo.png              # Logo principal
	├── profile.png           # Photo de profil
	├── ...                   # Autres logos et images
	└── projects/             # Icônes et bannières des projets
			├── b2r.png           # Icône projet
			├── ...               # Autres icônes
			└── banner/           # Bannières illustratives des projets
/css
	└── styles.css            # Feuille de style principale
/js
	├── main.js               # Gestion du routage et des interactions
	└── services/             # Services modulaires JS
			├── BaseService.js
			├── categoryService.js
			├── certificationService.js
			├── CollapsibleService.js
			├── cursorService.js
			├── experienceService.js
			├── homeService.js
			├── LangSelectorService.js
			├── languageService.js
			├── partialService.js
			├── projectService.js
			├── renderService.js
			└── routerService.js
/partials
	├── home.html             # Page d'accueil
	├── projects.html         # Page des projets
	├── experience.html       # Page des expériences
	├── contact.html          # Page de contact
/data
	├── en/                   # Données en anglais
	├── es/                   # Données en espagnol
	├── de/                   # Données en allemand
	├── fr/                   # Données en français
			├── home.json         # Texte d'accueil
			├── projects.json     # Données des projets
			├── experience.json   # Données des expériences
			├── certification.json# Données des certifications
```

<br>

## 📸 Aperçu

### Accueil
<img src="utils/1.png" alt="Accueil" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);" />

### Projets
<img src="utils/2.png" alt="Projets" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);" />

### Expériences
<img src="utils/3.png" alt="Expériences" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);" />

### Contact
<img src="utils/4.png" alt="Contact" style="border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);" />

<br>

## ✨ Points forts

- Design épuré et moderne, adapté à toutes les tailles d'écran
- Architecture modulaire facilitant la maintenance et l'extension
- Gestion multilingue via des fichiers JSON pour chaque langue
- Organisation claire des ressources (icônes, bannières, données)
- Effets interactifs et navigation fluide

<br>

## 📜 Licence

Ce projet est sous licence **MIT**. Consultez le fichier [LICENSE](./LICENSE) pour plus d'informations.

<br>
