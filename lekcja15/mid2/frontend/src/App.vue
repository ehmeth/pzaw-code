<script setup>
import { ref, computed } from "vue"
import HomePage from "@/pages/Home.vue"
import NewPollPage from "@/pages/NewPoll.vue"
import NotFoundPage from "@/pages/NotFound.vue"
import LoginPage from "@/pages/Login.vue"
import LoginPane from "./components/LoginPane.vue"

const routes = {
  '/': HomePage,
  '/poll/new': NewPollPage,
  '/login': LoginPage,
};

const currentPath = ref(window.location.hash);

const showLoginPane = computed(() => {
  return currentPath.value != "#/login";
})

window.addEventListener("hashchange", (event) => {
  currentPath.value = window.location.hash;
});

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || '/'] || NotFoundPage;
})
</script>

<template>
  <component v-show="showLoginPane" :is="LoginPane" />
  <component :is="currentView" />
</template>

<style scoped></style>
