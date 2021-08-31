import { createApp } from "vue";
import App from "./App.vue";
import router from "./router.js";
import "./assets/fontawesome/css/all.min.css";
import custom_auth from "./custom_auth";
import auth from "./auth";
const app = createApp(App).use(router);
// const i18nStrings = {
//   greetings: {
//     hi: "Hallo!",
//   },
// };
// app.use(custom_auth);
let config_auth = {
  path: "http://localhost:8000",
  autoFetch: true,
  fetchTime: 5000,
  fetchPath: "/api/user",
  user: "",
};
app.config.globalProperties.auth = new auth(config_auth);
app.mount("#app");
