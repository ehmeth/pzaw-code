import { readFile } from "node:fs/promises";

const filename = process.argv.length >= 3 ? process.argv[2] : "./data.json";

const readStart = Date.now();
try {
   console.log("This will print first");
   setTimeout(() => console.log("Finally?"), 10);
   setTimeout(() => console.log("This will print third?"), 0);
   console.log("This will print second");

   let data = await readFile(filename)
   const readEnd = Date.now();
   const parsedData = JSON.parse(data);
   const parseEnd = Date.now();
   console.log("This will print once the file read is done. Who knows, when that will be?");
   if (process.env.PRINT_DATA) {
      console.log("Data is", parsedData);
   }
   console.log(`Read took ${readEnd - readStart}ms, parse took ${parseEnd - readEnd}ms`);
} catch (error) {
   const readEnd = Date.now();
   console.log("This will print if the file read fails. Who knows, when that will be?");
   console.log("Error is", error);
   console.log(`Read took ${readEnd - readStart}ms`);
}

