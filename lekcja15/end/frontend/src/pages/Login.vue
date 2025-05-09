<script setup>
import { ref } from "vue"
import { useAuthStore } from "@/composables/AuthStore.js"

const username = ref("")
const password = ref("")

const authStore = useAuthStore();
</script>

<template>
  <h3>Please login</h3>
  <form>
    <div class="form-row">
      <label for="username">Username:</label>
      <input name="username" type="text" minlength="1" maxlength="150" v-model="username" />
    </div>

    <div class="form-row">
      <label for="password">Password:</label>
      <input name="username" type="password" minlength="1" maxlength="150" v-model="password" />
    </div>

    <input type="submit" value="Login" @click.prevent="authStore.login(username, password)" />
  </form>
  <span class="error" v-if="authStore.error">{{ authStore.error }}</span>
</template>

<style lang="css">
.form-row {
  max-width: 50%;
  min-width: 20rem;
  display: flex;
  padding: .1rem;
}

.form-row>label {
  flex: 1;
  text-align: end;
  padding-right: .2rem;
}

.form-row>input {
  flex: 3;
}
</style>
