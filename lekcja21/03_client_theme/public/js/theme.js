let theme = window.localStorage.getItem("fc_theme") ?? "light"

const toggle = document.getElementById("theme_toggle");
document.documentElement.dataset["theme"] = theme;

function updateToggle() {
    const toggleHtml = theme === "dark"
        ? `<strong>Ciemny</strong> | Jasny` 
        : `Ciemny | <strong>Jasny</strong>`;
    toggle.innerHTML = toggleHtml;    
}
updateToggle();

toggle.addEventListener("click", (event) => {
    event.preventDefault();
    if (theme === "dark") {
        theme = "light";
    } else {
        theme = "dark";
    }
    window.localStorage.setItem("fc_theme", theme);
    updateToggle();
    document.documentElement.dataset["theme"] = theme;
})