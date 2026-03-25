console.log("I'm the main module");

import { sharedObject } from "./shared.js";

let total = 0;
let other = sharedObject.loremIpsum.match(/[^a-z]/ig).length;

let currentStep = Promise.resolve("Starting calculations...")
   .then((message) => {
      console.log(message);
   })

for (
   let letter = 'a';
   letter != '{';
   letter = String.fromCharCode(letter.charCodeAt(0) + 1)
) {
   currentStep = currentStep.then(() => {
      let regex = new RegExp(letter, "gi");
      let count = sharedObject.loremIpsum.match(regex)?.length;
      total += count ?? 0;
      console.log(`Found ${count ?? 0} occurences of '${letter}'`);
   });
}

currentStep.then(() => {
   console.log(`Finished calculations.
   Total letters: ${total}. Total characters: ${total + other}`)
});

console.log("Lorem ipsum length:", sharedObject.loremIpsum.length);

console.log("LET'S GO!!!");



