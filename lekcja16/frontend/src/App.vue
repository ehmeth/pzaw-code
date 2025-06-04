<script setup>
import { ref, computed } from "vue"

import HomePage from "@/pages/Home.vue"
import NewPollPage from "@/pages/NewPoll.vue"
import NotFoundPage from "@/pages/NotFound.vue"
import PollPage from "@/pages/Poll.vue"
import LoginPage from "@/pages/Login.vue"
import RegistartionPage from "@/pages/Registration.vue"

import LoginPane from "./components/LoginPane.vue"

import { useAuthStore } from "@/composables/AuthStore.js"

const authStore = useAuthStore();

const routes = {
  '/': {
    component: HomePage,
    loginRequired: false,
  },
  '/poll/new': {
    component: NewPollPage,
    loginRequired: true,
  },
  '/login': {
    component: LoginPage,
    loginRequired: false,
  },
  '/register': {
    component: RegistartionPage,
    loginRequired: false,
  },
};

const paramRoutes = [
  {
    pattern: /^poll\/(\d+)\/$/,
    component: PollPage,
    params: [{ name: "poll-id", type: Number }],
  }
]

const currentPath = ref(window.location.hash);

const showLoginPane = computed(() => {
  return currentPath.value != "#/login";
})

window.addEventListener("hashchange", (event) => {
  currentPath.value = window.location.hash;
});

let componentProps = {};

const currentView = computed(() => {
  var view = NotFoundPage;
  const routeUrl = currentPath.value.slice(1);
  const userLoggedIn = authStore.isLoggedIn.value;

  componentProps = {};

  const target = routes[routeUrl || '/'] || null;
  if (target) {
    if (target.loginRequired && !userLoggedIn) {
      view = LoginPage;
    } else if (target.component === LoginPage && userLoggedIn) {
      window.location.hash = "#/";
    } else {
      view = target.component;
    }
  } else {
    for (const route of paramRoutes) {
      const results = route.pattern.exec(routeUrl);

      if (results) {
        view = route.component;
        for (let i = 0; i < route.params.length; ++i) {
          if (route.params[i].type === Number) {
            componentProps[route.params[i].name] = +results[i + 1];
          }
        }
        break;
      }
    }
  }

  return view;
})
</script>

<template>
  <component v-show="showLoginPane" :is="LoginPane" />
  <component :is="currentView" v-bind="componentProps" />
</template>

<style scoped></style>
