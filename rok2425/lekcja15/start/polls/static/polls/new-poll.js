{
    const { createApp } = Vue;
    
    const app = createApp({
      data() {
        return {
          question: "What is your favorite color?",
          choiceList: ["Red", "Blue"],
        };
      },
      methods: {
        addNextChoice() {
          this.choiceList.push(new String());
        },
        createPoll() {
          const questionInput = document.getElementById("id_question");
          questionInput.value = this.question;

          const choicesInput = document.getElementById("id_choices");
          choicesInput.value = JSON.stringify(this.choiceList);

          document.getElementById("new-poll-form").submit();
        },
      },
    });
    
    app.mount("#vueapp");
}