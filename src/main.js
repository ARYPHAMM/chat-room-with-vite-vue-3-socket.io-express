import { createApp } from "vue";
import App from "./App.vue";
import router from "./router.js";
import "./assets/fontawesome/css/all.min.css";

createApp(App).use(router).mount("#app");
