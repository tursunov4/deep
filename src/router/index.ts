import { createRouter, createWebHistory } from "vue-router";
const HomePage = () => import("../components/HomePage/HomePage.vue");
const Accessories = () => import("../components/Category.vue");
const Collections = () =>
  import("../components/Collections/CollectionsPage.vue");
const Product = () => import("../components/ProductPage/ProductPage.vue");
const SubCategory = () => import("../components/SubCategory/SubCategory.vue");
const Doors = () => import("../components/Doors/DoorsPage.vue");
const DoorProduct = () =>
  import("../components/DoorProductPage/DoorProductPage.vue");
const Category = () => import("../components/Category.vue");
const About = () => import("../components/AboutPage.vue");
const Cart = () => import("../components/Cart/CartPage.vue");
const Catalogs = () => import("../components/CatalogsPage.vue");

const Inspirations = () =>
  import("../components/Inspiration/InspirationsPage.vue");
const Inspiration = () =>
  import("../components/Inspiration/InspirationPage.vue");
const routes = [
  { path: "/", component: HomePage },
  { path: "/accessories", component: Accessories },
  {
    path: "/sub-category/:id",
    component: SubCategory,
    props: { collection: "", sales: false, color: "" },
  },
  { path: "/category/:id", component: Category, props: { category: "" } },
  { path: "/collections", component: Collections, props: { collection: "" } },
  { path: "/product/:id", component: Product, props: { color: "" } },
  { path: "/doors", component: Doors },
  { path: "/door/:id", component: DoorProduct, props: true },
  { path: "/about", component: About },
  { path: "/cart", component: Cart },
  { path: "/catalogs", component: Catalogs },
  { path: "/inspirations", component: Inspirations },
  {
    path: "/inspiration/:id",
    name: "inspiration-page",
    component: Inspiration,
  },

  {
    path: "/lighting",
    name: "lighting",
    component: () => import("../components/LightingPage/LightingPage.vue"),
  },
];

const router = createRouter({
  scrollBehavior(to, from) {
    if (to.hash && window.document) {
      let element = window.document.querySelector(to.hash);
      if (!element) return;
      element.scrollIntoView({ behavior: "smooth" });
      to.hash = "";
    } else if (to.path === from.path) {
      let element = window.document.querySelector("#app");
      if (!element) return;
      element.scrollIntoView({ behavior: "smooth" });
      return;
    } else return { top: 0 };
  },
  history: createWebHistory(),
  routes,
});

export default router;
