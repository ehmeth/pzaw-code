console.log("I'm the shared module");

import fs from "node:fs/promises";

// setTimeout(function () {
   // console.log("Normally I would go last, but here I am");
// }, 0);

export const sharedObject = JSON.parse(await fs.readFile("./config.json"));

// fs.readFile("./config.json").then((data) => {
   // console.log("Finished reading the file!");
   // const obj = JSON.parse(data);
   // for (let key in obj) {
      // console.log("Assigning key:", key);
      // sharedObject[key] = obj[key];
   // }
// });
