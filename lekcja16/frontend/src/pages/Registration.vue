<script setup>
import { ref } from "vue"
import { useAuthStore } from "@/composables/AuthStore.js"

const username = ref("")
const password = ref("")
const passwordConfirmation = ref("")

let errorMessage = ref("")

const authStore = useAuthStore();

async function registerUser() {
  errorMessage.value = ""

  if (username.value.length < 3) {
    errorMessage.value = "Username must be at least 3 characters";
  }
  let usernameChars = "abcdefghijklmnopqrstuvwz" +
                      "abcdefghijklmnopqrstuvwz".toUpperCase() +
                      "0123456789" +
                      "_-@.";
  let allUsernameCharsAllowed = username.value.split("")
                                  .every(c => usernameChars.indexOf(c) >= 0);
  
  if (!allUsernameCharsAllowed) {
    errorMessage.value = "Username may consist of letters, numbers and _-@."
  }

  if (password.value !== passwordConfirmation.value) {
    errorMessage.value = "Passwords do not match";
  }
  if (password.value.length < 8) {
    errorMessage.value = "Password must be at least 8 characters long";
  }

  const specialChars = "-+=/_[]{}<>,.;'\"!@#$%^&*()";
  let hasSpecialChar = specialChars.split("")
                        .some(c => password.value.indexOf(c) >= 0)
  if (!hasSpecialChar) {
    errorMessage.value = `Password should have at least 1 special character "${specialChars}"`;
  }

  if (!errorMessage.value) {
    await authStore.register(username.value, password.value);
    console.log(authStore.error.value)
    if (!authStore.error.value) {
      window.location.hash = ""
    } else {
      errorMessage.value = authStore.error.value;
    }
  }
}
</script>


<template>
  <h3>Create a new account</h3>
  <form>
    <div class="form-row">
      <label for="username">Username:</label>
      <input name="username" type="text" minlength="1" maxlength="150" v-model="username" />
    </div>

    <div class="form-row">
      <label for="password">Password:</label>
      <input name="pass" type="password" minlength="1" maxlength="150" v-model="password" />
    </div>

    <div class="form-row">
      <label for="password-confirmation">Retype password:</label>
      <input name="passconfirmation" type="password" minlength="1" maxlength="150" v-model="passwordConfirmation" />
    </div>

    <input type="submit" value="Create account" @click.prevent="registerUser()" />
  </form>
  <span class="error" v-if="errorMessage" >{{ errorMessage }}</span>
</template>

<style lang="css">
.form-row {
  max-width: 50%;
  min-width: 35rem;
  display: flex;
  padding: .1rem;
}

.form-row>label {
  flex: 1;
  text-align: end;
  padding-right: .2rem;
}

.form-row>input {
  flex: 2;
}
</style>
