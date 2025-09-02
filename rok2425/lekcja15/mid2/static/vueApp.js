const { createApp } = Vue;

const app = createApp({
  data() {
    return {
      plot_summary:
        "Friends is a 90s sitcom about a group of friends in New York and their struggles with their early adult life careers and love life.",
      favorite_character: "just passing",
      new_character_name: "",
      new_character_surname: "",
      characters: [
        {
          name: "Phoebe",
          surname: "Buffey",
        },
        {
          name: "Chandler",
          surname: "Bing",
        },
        {
          name: "Joey",
          surname: "Tribbiani",
        },
        {
          name: "Ross",
          surname: "Geller",
        },
        {
          name: "Monica",
          surname: "Geller",
        },
        {
          name: "Reachel",
          surname: "Green",
        },
      ],
    };
  },
  methods: {
    selectFavoriteCharacter(event, character) {
      this.favorite_character = character;
    },
    addNewCharacter(event) {
      event.preventDefault();

      this.characters.push({
        name: this.new_character_name,
        surname: this.new_character_surname,
      });
    },
  },
});

app.mount("#app");
