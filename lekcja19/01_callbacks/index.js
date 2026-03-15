console.log("This will print first");

setTimeout(() => console.log("Finally!"), 10);
setTimeout(() => console.log("This will print third"), 0);

console.log("This will print second");
