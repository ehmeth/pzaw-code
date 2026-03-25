waiting();

async function waiting() {
   console.trace();
   let number = await getNumber();
   console.trace();
}

async function getNumber() {
   return 42;
}
