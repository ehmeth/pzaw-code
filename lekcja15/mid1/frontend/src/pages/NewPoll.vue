<script setup>
  import { ref } from "vue"

  const question=ref("");
  const choiceList=ref(["",""]);

  // TODO(kleindan) We should probablu fetch these from the backend
  const questionMaxLength=ref(200);
  const choiceMaxLength=ref(200);

  function addNextChoice() {
    choiceList.value.push(new String());
  }

  const csrfToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrftoken="))
    ?.split('=')[1]

  async function createPoll() {
    if (!csrfToken)
      return false;

    const apiResponse = await fetch('/polls/api/new', {
      "method": "POST",
      "headers": {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      credentials: "same-origin",
      body: JSON.stringify({ question: question.value, choices: choiceList.value }),
    });
    if (apiResponse.status === 200) {
      const data = await apiResponse.json();
      window.location.hash = `#/polls/${data.poll_id}`;
    } else {
      const data = await apiResponse.json();
      console.error(data);
    }
  }
</script>

<template>
    <h2>Create new poll</h2>
  <form class="new-poll" @submit.prevent="createPoll">
    <label for="question-text">Question:</label>
    <input type="text" v-model="question" name="question-text" placeholder="What do you want to ask?" minlength="1" :maxlength="questionMaxLength"></input>

    <ul>
      <li v-for="(choice, idx) in choiceList" :key="`choice-${idx}`">
        <label for="`choice-text-${idx}`">Choice:</label>
        <input type="text" id="`choice-text-${idx}`" v-model="choiceList[idx]" minlength="1" :maxlength="choiceMaxLength" placeholder="Choice text.." />
      </li>
    </ul>

    <input type="button" class="add-choice" value="+" id="add-choice-btn" @click="addNextChoice" />
    <label class="add-choice" for="add-choice-btn">Add new choice</label>

    <input type="submit" id="create-poll-btn" value="Create new poll" />
  </form>
</template>

<style lang="css" scoped>
.new-poll ul {
  margin-top: 0.5rem;
}
.new-poll ul li {
  margin: 0.1rem 0;
}

.new-poll input[type=submit]{
  display: block;
}

.new-poll input[type=button]{
  display: inline-block;

}

.new-poll input[type=button],.add-choice {
  background-color: #2c5;
  border-radius: .4rem;
  width: 1.3rem;
  height: 1.3rem;
  border: none;
  text-align: center;
  vertical-align:middle;
  margin: .1rem;
}

.new-poll label .add-choice {
  background-color: #2c5;
  border-radius: .4rem;
  width: 1.3rem;
  height: 1.3rem;
  border: none;
  text-align: center;
  vertical-align:middle;
  margin: .1rem;
}
</style>
