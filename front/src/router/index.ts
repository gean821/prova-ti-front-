import { createRouter, createWebHistory } from "vue-router"
import VeiculoPage from "../Pages/VeiculoPage.vue"
import AcessoriosPage from "../Pages/AcessoriosPage.vue"

const routes = [
  { path: "/", component: VeiculoPage },
  { path: "/acessorios", component: AcessoriosPage }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})