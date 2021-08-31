import { createWebHistory, createRouter } from "vue-router";
import Chat from "./components/Chat.vue";
import ListChat from "./components/ListChat.vue";
import Register from "./components/Register.vue";

const routes = [
  {
    path: "/",
    name: "List",
    component: ListChat,
  },
  {
    path: "/chat",
    name: "Chat",
    component: Chat,
  },
  {
    path: "/dang-ky",
    name: "Register",
    component: Register,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
