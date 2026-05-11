export class Flashcard {
  constructor(front, back) {
    this.front = front;
    this.back = back;
  }

  render() {
    const element = document.importNode(template.content, true);

    element
      .querySelector(".flashcard__inner")
      .addEventListener("click", flip_handler);
    element.querySelector(".flashcard__face--front").innerText = this.front;
    element.querySelector(".flashcard__face--back").innerText = this.back;
    return element;
  }
}

function flip_handler(event) {
  event.currentTarget.classList.toggle("is-flipped");
}

const template = document.createElement("template");
template.innerHTML = `
      <div class="flashcard">
          <div class="flashcard__inner">
              <div class="flashcard__face flashcard__face--front "></div>
              <div class="flashcard__face flashcard__face--back"></div>
          </div>
      </div>
`.trim();
document.body.appendChild(template);

/// CSS based on https://github.com/TylerPottsDev/card-flip
const css = `
.flashcard {
  margin: 100px auto 0;
  width: 400px;
  height: 200px;
  perspective: 1000px;
}

.flashcard__inner {
  width: 100%;
  height: 100%;
  transition: transform 1s;
  transform-style: preserve-3d;
  cursor: pointer;
  position: relative;
}

.flashcard__inner.is-flipped {
  transform: rotateX(180deg);
}

.flashcard__face {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  overflow: hidden;
  border-radius: 16px;
  box-shadow: 0px 3px 18px 3px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(to bottom right, var(--background), var(--backdrop));
}

.flashcard__face--front {
}  

.flashcard__face--back {
  background-color: var(--background);
  transform: rotateX(180deg);
}

.flashcard__content {
  width: 100%;
  height: 100%;
}
`.trim();

const stylesheet = new CSSStyleSheet();
stylesheet.replaceSync(css);
document.adoptedStyleSheets.push(stylesheet);

export default {
  Flashcard,
};
