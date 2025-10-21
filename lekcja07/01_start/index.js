import express from "express";
import ejs from "ejs";

const port = 8000;
const card_categories = ["j. angielski - food", "stolice europejskie"];

const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/cards/categories/", (req, res) => {
  res.render("categories", {
    title: "Kategorie",
    categories: card_categories,
  });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
