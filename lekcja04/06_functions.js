// deklaracja funkcji
function myFunction() {
   console.log("In my function");
}

// wywołanie funkcji
myFunction();

// Funkcja może przyjmować wartości podczas wywołania oraz zwracać wartości na zewnątrz
// To jest deklaracja funkcji z jednym parametrem o nazwie 'number'
function multiplyByTwo(number) {
   return number*2;
}

console.log("Wywołanie z argumentem 2 daje wynik", multiplyByTwo(2));

// JavaScript podchodzi dość luźno do wywołań funkcji w kwestii liczby argumentów
console.log("Wywołanie bez argumentu daje wynik", multiplyByTwo());
console.log("Wywołanie z argumentami 3, 4, 5 daje wynik", multiplyByTwo(3, 4, 5));

// Dzięki temu mamy sporą swobodę w pisaniu funkcji obsługujących różne zestawy parametrów
// ale musimy pamiętać, że kompilator nas nie uchroni przed wywołaniem funkcji z nieoczekiwanymi
// argumentami. Dlatego możemy użyć kilku sztuczek.

// Możemy nadawać parametrom domyślne wartości
function multiplyByTwoProtected(number = 0) {
   return number*2;
}
console.log("Wywołanie z argumentem 2 daje wynik", multiplyByTwoProtected(2));
console.log("Wywołanie bez argumentu daje wynik", multiplyByTwoProtected());

// Możemy powiedzieć JS, że chcemy aby wszelkie dodatkowe parametry
// zadeklarowane po spodziewanych były umieszczone w tablicy o wybranej przez
// nas nazwie (tutaj 'rest')
function getAllTheArgumentsAfterFoo(foo, ...rest) {
   console.log("Pierwszy argument:", foo);
   console.log("Cała reszta", rest);
}

getAllTheArgumentsAfterFoo("foo", "bar", "baz");
getAllTheArgumentsAfterFoo("foo");
getAllTheArgumentsAfterFoo();

// Albo możemy wykorzystać niejawny parametr 'arguments'
function getAllTheArguments(foo) {
   if (arguments.length > 1) {
      console.log(foo, arguments[1]);
   } else {
      console.log(foo, "and no additional arguments provided");
   }
}

getAllTheArguments("foo", "bar", "baz");
getAllTheArguments("foo");
getAllTheArguments();

// Ważna uwaga, funkcje deklarowane jako "arrow functions" nie mają dostępu do niejawnego "arguments"
const thisWontWork = (foo) => {
   console.log(foo, arguments);
}
// Poniższa linia zadziała, ale wydrukuje argumenty przekazane przez Node.js
// dla wykonania całego pliku... ciekawi mogą sprawdzić, co się tam znajduje
// thisWontWork("foo", "bar", "baz");

// Funkcje mogą też zmieniać wartości przekazane podczas wywołania
// o ile są to dane przekazywane jako referencje (w uproszczeniu obiekty, tablice, etc.)
function annotateObject(object, number, string) {
   object.comment = "note"; // to zmieni argument poza funkcją
   number = 42; // to NIE wpłynie na dane poza funkcją
   string = "set in function"; // to NIE wpłynie na dane poza funkcją
}

let myObject = { message: "hello" };
let myNumber = 3;
let myString = "set globally";
annotateObject(myObject, myNumber, myString);
console.log(myObject, myNumber, myString);

// Funkcje mogą być też umieszczone na obiektach
// W takiej sytuacji mówimy o takiej funkcji jako o "metodzie" obiektu
// Taka funkcja może korzystać ze słowa kluczowego "this" aby odnosić się do
// obiektu, na którym jest umieszczona
let greeter = {
   name: "Bob",
   greet: function () { console.log("Hi, I am", this.name) },
}

// Wywołanie metody obiektu
greeter.greet();
greeter.name = "Alice"
greeter.greet();

// Alternatywna składnia dla deklarowania metod
let loud_greeter = {
   name: "Bob",
   greet() { console.log("HI, I AM", this.name.toUpperCase()) },
}

loud_greeter.greet();
loud_greeter.name = "Alice"
loud_greeter.greet();

// I znów uwaga na temat arrow functions: nie mają one dostępu do słowa kluczowego "this"
// więc nie mogą być używane jako metody na obiektach
let bad_greeter = {
   name: "Bob",
   greet: () => { console.log("Hi, I am", this.name) },
}

bad_greeter.greet();
