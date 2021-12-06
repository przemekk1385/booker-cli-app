import { createRouter, createWebHistory } from "vue-router";
import Book from "../views/Book.vue";

const routes = [
  {
    path: "/",
    name: "Book",
    component: Book,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
