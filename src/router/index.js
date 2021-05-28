import {createRouter, createWebHashHistory, createWebHistory} from "vue-router";
import Main from "../views/Main";
import Login from "../views/Login";
import AdminPanel from "../views/Admin-panel";
import AdminResults from "../views/Admin-results";
import Results from "../views/Results";
import CreateScript from "../views/Create-script";

const routes = [
  {
    path: "/",
    name: "Main",
    component: Main,
  },
  {
    path: "/results",
    name: "Results",
    component: Results,
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
    path: "/admin-results",
    name: "Admin Results",
    component: AdminResults,
  },
  {
    path: "/add-script",
    name: "Add script",
    component: CreateScript
  }
];

const router = createRouter({
  history: process.env.IS_ELECTRON ? createWebHashHistory(process.env.BASE_URL) : createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
