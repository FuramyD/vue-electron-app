import { createRouter, createWebHistory } from "vue-router";
import Main from "../views/Main";
import Login from "../views/Login";
import AdminPanel from "../views/Admin-panel";
import Results from "../views/Results";
import CreateScript from "../views/Create-script";

const routes = [
  {
    path: "/",
    name: "Main",
    component: Main,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/admin",
    name: "Admin",
    component: AdminPanel,
  },
  {
    path: "/results",
    name: "Results",
    component: Results,
  },
  {
    path: "/add-script",
    name: "Add script",
    component: CreateScript
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
