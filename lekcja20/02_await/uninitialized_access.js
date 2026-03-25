console.log("Module start");
console.log(waiting());
console.log("Module end");

async function waiting() {
   console.log("function start");
   let number = await getNumber();
   console.log("function end, got number:", number);

   async function getNumber() {
      console.log("getting number, outer number currently", number);
      return 42;
   }
}
