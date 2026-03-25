function getNumber() {
   return 42;
}

async function getNumberAsync() {
   return 42;
}

function print(number) {
   console.log(number);
}

print(getNumber());
print(getNumberAsync());

getNumberAsync().then(print);
