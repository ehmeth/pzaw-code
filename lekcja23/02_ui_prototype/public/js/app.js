const container = document.getElementById("container")

let count = localStorage.getItem("fc_count") ?? 0;

const paragraph = container.appendChild(document.createElement("p"));

function updateParagraph() {
    paragraph.innerText = `Clicks: ${count}`;
}
updateParagraph();

const button = container.appendChild(document.createElement("button"));
button.innerText = "Click me!";

button.addEventListener("click", (event) => {
    count++;
    localStorage.setItem("fc_count", count)
    updateParagraph();
})
