console.log("quiz start");

let results = await fetch("/api/cardsets", {});
if (results.ok) {
    let data = await results.json();

    const quizContainer = document.getElementById("quiz");
    const temp = document.createElement("pre");

    temp.innerText = JSON.stringify(data, null, 2);
    quizContainer.appendChild(temp);

    const template = document.getElementById("categoryTemplate");
    for (let category of data) {
        const categoryElement = document.importNode(template.content, true);
        const [categoryName] = categoryElement.querySelectorAll(".categoryName");
        categoryName.innerText = category.name;
        quizContainer.appendChild(categoryElement);
    }
}
