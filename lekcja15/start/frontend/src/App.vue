<script setup>
  import {ref, computed} from "vue"
  import HomePage from "@/pages/Home.vue"
  import NewPollPage from "@/pages/NewPoll.vue"
  import NotFoundPage from "@/pages/NotFound.vue"

  const routes = {
    '/': HomePage,
    '/poll/new': NewPollPage,
  };

  const currentPath = ref(window.location.hash);

  window.addEventListener("hashchange", (event) => {
    currentPath.value = window.location.hash;
  });

  const currentView = computed(() => {
    return routes[currentPath.value.slice(1) || '/'] || NotFoundPage;
  })
</script>

<template>
  <nav>
    <a href="#/">Home</a>
    <a href="#/poll/new">New poll</a>
  </nav>
  <component :is="currentView" />
</template>

<style scoped></style>
