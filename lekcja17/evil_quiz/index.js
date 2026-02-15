import express from "express";

const port = process.env.PORT || 9000;

const app = express();
app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
