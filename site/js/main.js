import { routerService } from "./services/routerService.js";
import { cursorHaloService } from "./services/cursorService.js";

// setup the router service
routerService.setup(document.getElementById("content"));

// add routes
routerService.addRoute("/", { partial: "/partials/home.html" });
routerService.addRoute("/home", { partial: "/partials/home.html" });
routerService.addRoute("/projects", { partial: "/partials/projects.html" });
routerService.addRoute("/contact", { partial: "/partials/contact.html" });
routerService.addRoute("/experience", { partial: "/partials/experience.html" });

// start
routerService.start();

// start the cursor halo service
cursorHaloService;