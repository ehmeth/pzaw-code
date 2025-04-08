<script setup>
import { ref, onMounted } from "vue";

const pollList = ref([]);

onMounted(() => {
    fetch("/polls/api/polls")
        .then((response) => response.json())
        .then((data) => {
            pollList.value = data.pollList;
        })
});
</script>

<template>
    <h2>Recent polls:</h2>
    <ul>
        <li v-for="poll in pollList"><a :href="`/polls/${poll.id}`">{{ poll.question }}</a></li>
    </ul>
    <a href="/polls/new" class="new-poll-button">Add new poll</a>
</template>

<style scoped></style>
