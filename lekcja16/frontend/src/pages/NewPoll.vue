<script setup>
import { ref } from "vue"
import { makeRequest } from "@/helpers/fetchWrapper.js"

const question = ref("");
const choiceList = ref(["", ""]);

// TODO(kleindan) We should probablu fetch these from the backend
const questionMaxLength = ref(200);
const choiceMaxLength = ref(200);

function addNextChoice() {
  choiceList.value.push(new String());
}

async function createPoll() {
  let data = await makeRequest.post('/polls/api/new', { question: question.value, choices: choiceList.value })
  window.location.hash = `#poll/${data.poll_id}/`;
}
</script>

<template>
  <h2>Create new poll</h2>
  <form class="new-poll" @submit.prevent="createPoll">
    <label for="question-text">Question:</label>
    <input type="text" v-model="question" name="question-text" placeholder="What do you want to ask?" minlength="1"
      :maxlength="questionMaxLength"></input>

    <ul>
      <li v-for="(choice, idx) in choiceList" :key="`choice-${idx}`">
        <label for="`choice-text-${idx}`">Choice:</label>
        <input type="text" id="`choice-text-${idx}`" v-model="choiceList[idx]" minlength="1"
          :maxlength="choiceMaxLength" placeholder="Choice text.." />
      </li>
    </ul>

    <input type="button" class="add-choice" value="+" id="add-choice-btn" @click="addNextChoice" />
    <label for="add-choice-btn">Add new choice</label>

    <input type="submit" id="create-poll-btn" value="Create new poll" />
  </form>
  <nav>
    <a href="#/" class="back-btn">← back</a>
  </nav>
</template>

<style lang="css" scoped>
nav {
  display: block;
  margin-top: 1rem;
}

.new-poll ul {
  margin-top: 0.5rem;
}

.new-poll ul li {
  margin: 0.1rem 0;
}

.new-poll input[type=submit] {
  display: block;
}

.new-poll input[type=button] {
  display: inline-block;

}

.new-poll input[type=button],
.add-choice {
  background-color: #b1adfe;
  border-radius: .4rem;
  width: 1.3rem;
  height: 1.3rem;
  border: none;
  text-align: center;
  vertical-align: middle;
  margin: .1rem;
}

.new-poll label {
  width: 1.3rem;
  height: 1.3rem;
  border: none;
  text-align: center;
  vertical-align: middle;
  margin: .1rem;
}
</style>
