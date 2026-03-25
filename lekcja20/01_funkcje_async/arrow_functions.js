let getNumber = async () => 42;

function print(number) {
   console.log(number);
}

print(getNumber());

getNumber().then(print);
