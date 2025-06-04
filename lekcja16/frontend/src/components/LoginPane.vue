<script setup>
import { useAuthStore } from "@/composables/AuthStore.js"

const authStore = useAuthStore();
</script>

<template>
  <div class="login">
    <a v-show="authStore.isLoggedIn.value" id="logout-btn" @click="authStore.logout()">Logout</a>
    <a v-show="!authStore.isLoggedIn.value" href="#/login" id="login-btn">Login</a>
    <span v-show="authStore.isLoggedIn.value" id="greeting">Welcome {{ authStore.username }}</span>
  </div>
</template>

<style lang="css" scoped>
.login {
  display: flex;
  flex-direction: row-reverse;
}

.login #greeting {
  flex: 1 0 auto;
}

.login :is(#logout-btn, #login-btn) {
  flex: 0 0 auto;
  cursor: pointer;
}
</style>
