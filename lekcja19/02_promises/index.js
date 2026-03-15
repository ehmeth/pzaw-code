console.log("This will print first");

setTimeout(() => console.log("This will print last"), 0);

Promise.resolve()
   .then(() => console.log("This will print third"))
   .then(() => console.log("This will print fifth"))

Promise.resolve()
   .then(() => console.log("This will print fourth"))

console.log("This will print second");
