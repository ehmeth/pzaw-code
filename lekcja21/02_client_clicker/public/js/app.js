console.log("Hello, world");

let count = window.localStorage.getItem("fc_count") ?? 0;

const container = document.getElementById("container");
const paragraph = container.appendChild(document.createElement("p"));

function updateParagraph() {
    paragraph.innerText = `The count: ${count}`;
}
updateParagraph();

const button = document.createElement("button");
button.innerText = "Click me"
button.addEventListener("click", () => {
    count++;
    localStorage.setItem("fc_count", count);
    updateParagraph();
})

container.appendChild(paragraph);
container.appendChild(button);
