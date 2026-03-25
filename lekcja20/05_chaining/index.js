import { readFile } from "node:fs/promises";

const filename = process.argv.length >= 3 ? process.argv[2] : "./data.json";

function parseData(fileContents) {
   return JSON.parse(fileContents);
}

function alterData(data) {
   return {
      result: data.values.foo * data.values.multiplier,
      createdAt: Date.now(),
      ...data.values
   };
}

function printData(data) {
   console.log(data)
}

try {
   let fileContents = await readFile(filename);
   let data = await parseData(fileContents);
   let augmentedData = await alterData(data);
   printData(data);
} catch (error) {
   console.error("FAILED due to", error);
}

