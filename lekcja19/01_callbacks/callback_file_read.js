import { readFile } from "node:fs";

const filename = process.argv.length >= 3 ? process.argv[2] : "./data.json";

function handleFileRead(error, data) {
   const readEnd = Date.now();
   const parsedData = error == null ? JSON.parse(data) : null;
   const parseEnd = Date.now();
   console.log("This will print once the file read is done. Who knows, when that will be?");
   console.log("Error is", error);
   if (process.env.PRINT_DATA) {
      console.log("Data is", parsedData);
   }
   console.log(`Read took ${readEnd - readStart}ms, parse took ${parseEnd - readEnd}ms`);
}

const readStart = Date.now();
readFile(filename, handleFileRead);

console.log("This will print first");

setTimeout(() => console.log("Finally?"), 10);
setTimeout(() => console.log("This will print third?"), 0);

console.log("This will print second");
