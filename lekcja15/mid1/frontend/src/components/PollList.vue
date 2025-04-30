
<script setup>
import { ref } from "vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  }
})

const pollList = ref();

async function getPollList() {
  const apiData = await fetch('/polls/api/polls').then((r) => r.json());
  pollList.value = apiData.pollList;
}

getPollList();
</script>

<template>
    <h2>{{ props.title }}:</h2>
    <ul>
        <li v-for="poll in pollList"><a :href="`/polls/${poll.id}`">{{ poll.question }}</a></li>
    </ul>
</template>

<style scoped></style>
