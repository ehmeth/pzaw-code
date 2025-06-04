<script setup>
import { makeRequest } from "@/helpers/fetchWrapper.js";
import { ref, computed } from "vue";

const props = defineProps({
  pollId: {
    type: Number,
    required: true,
  }
});
const question = ref("");
const choices = ref([]);
const voting_disabled = ref(true);

const votesCount = computed(() => {
  return choices.value.reduce((sum, choice) => sum + choice.votes, 0)
});

async function getData() {
  const data = await makeRequest.get(`polls/api/${props.pollId}/`);
  question.value = data.poll.question;
  choices.value.push(...data.poll.choices);
  voting_disabled.value = false;
}

getData();

async function voteFor(choiceId) {
  voting_disabled.value = true;
  const response = await makeRequest.post(`polls/api/${props.pollId}/vote`, { choiceId: choiceId })
  if ("votes" in response && response.votes > 0) {
    const choice = choices.value.find((c) => c.id === choiceId);
    choice.votes = response.votes
  }

  voting_disabled.value = false;
}

</script>

<template>
  <div>{{ question }}</div>
  <ul>
    <li v-for="choice in choices" id="`choice-${choice.id}-row" class="choice-row">
      <span class="choice-text">{{ choice.text }}</span>
      <span class="choice-votes">votes: {{ choice.votes }}</span>
      <button class="choice-vote-btn" @click="voteFor(choice.id)" :disabled="voting_disabled">Vote</button>
    </li>
  </ul>
  <div>Total votes: {{ votesCount }}</div>
  <a href="#/">Go back</a>
</template>

<style lang="css" scoped>
.choice-row {
  display: flex;
  flex-direction: row;
}

.choice-text {
  flex: 1
}

.choice-votes {
  flex: 1
}

.choice-vote-btn {
  flex: 1
}
</style>
